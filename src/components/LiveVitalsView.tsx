import { useEffect, useMemo, useRef, useState } from "react"
import { mapPoints, type UserCondition } from "../data/mock"
import { isMyDeviceUserId, MY_DEVICE_USER_ID, myDeviceCareUser } from "../data/careUsers"
import { ConnectedUsersPanel, LiveSummaryStrip } from "./liveVitals/LiveVitalsGrid"
import { CareConsole, type CareSample } from "./liveVitals/CareConsole"
import { useWatchLive } from "../lib/useWatchLive"
import type { WatchLiveSnapshot } from "../lib/supabase"
import type { ProtectionDevice } from "../data/devices"

type Sample = CareSample

function seedOf(id: string) {
  return id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
}

function baseFor(id: string, type: (typeof mapPoints)[number]["type"]) {
  const s = seedOf(id)
  const alert = type === "alert"
  return {
    hr: alert ? 102 : type === "verify" ? 86 : 72 + (s % 6),
    sbp: alert ? 138 : 118 + (s % 8),
    dbp: alert ? 88 : 74 + (s % 6),
    spo2: alert ? 94 : 97 + (s % 3),
    sugar: 95 + (s % 25),
    temp: 36.4 + (s % 8) / 10,
    steps: 2800 + s * 41,
    roll: 8 + (s % 10),
    hrv: alert ? 28 : 45 + (s % 20),
    resp: alert ? 20 : 14 + (s % 4),
    eda: alert ? 3.4 : 1.4 + (s % 12) / 10,
    stress: alert ? 62 : 18 + (s % 25),
    accel: alert ? 1.4 : 0.25 + (s % 8) / 10,
    activityLevel: alert ? 78 : 25 + (s % 40),
    af: alert,
  }
}

function nextSample(
  prev: Sample | null,
  id: string,
  type: (typeof mapPoints)[number]["type"],
  i: number,
): Sample {
  const b = baseFor(id, type)
  const tick = Date.now() / 1000 + i
  const now = new Date()
  const t = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  const hr = Math.round(b.hr + Math.sin(tick * 1.7) * 4 + Math.sin(tick * 0.4) * 2)
  const sbp = Math.round(b.sbp + Math.sin(tick * 0.6) * 3)
  const dbp = Math.round(b.dbp + Math.sin(tick * 0.55) * 2)
  const spo2 = Math.min(100, Math.max(90, Math.round(b.spo2 + Math.sin(tick * 0.35) * 1.2)))
  const sugar = Math.round(b.sugar + Math.sin(tick * 0.2) * 4)
  const temp = Number((b.temp + Math.sin(tick * 0.25) * 0.08).toFixed(1))
  const steps = (prev?.steps ?? b.steps) + (Math.random() > 0.55 ? 1 : 0)
  const roll = Math.max(0, Math.round(b.roll + Math.sin(tick * 2.2) * 5 + Math.random() * 2))
  const hrv = Math.max(15, Math.round(b.hrv + Math.sin(tick * 0.5) * 4))
  const resp = Math.max(10, Math.round(b.resp + Math.sin(tick * 0.3) * 1.2))
  const eda = Number((b.eda + Math.sin(tick * 0.45) * 0.15).toFixed(1))
  const stress = Math.max(5, Math.min(95, Math.round(b.stress + Math.sin(tick * 0.35) * 5)))
  const accel = Number(
    Math.max(0.05, b.accel + Math.sin(tick * 1.4) * 0.2 + Math.random() * 0.08).toFixed(2),
  )
  const activityLevel = Math.max(0, Math.min(100, Math.round(b.activityLevel + Math.sin(tick * 0.6) * 8)))
  const sudden = accel > 1.1 ? 1 : 0
  const immobile = activityLevel < 12 ? 1 : 0
  const phase = (tick * 8) % (Math.PI * 2)
  const ecg =
    Math.sin(phase) * 18 +
    Math.sin(phase * 3) * 6 +
    (Math.sin(phase * 12) > 0.92 ? 55 : 0) +
    Math.sin(phase * 0.5) * 4
  return {
    t,
    hr,
    sbp,
    dbp,
    spo2,
    sugar,
    temp,
    steps,
    roll,
    ecg: Math.round(ecg),
    hrv,
    resp,
    eda,
    stress,
    accel,
    activityLevel,
    sudden,
    immobile,
  }
}

function sampleFromWatch(
  prev: Sample | null,
  device: ProtectionDevice,
  snap: WatchLiveSnapshot | null,
): Sample {
  const now = new Date()
  const t = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  const hr = device.heartRate
  const spo2 = device.spo2
  const temp = Number(device.skinTemperature.toFixed(1))
  const sbp = snap?.health?.bp_systolic ?? prev?.sbp ?? 120
  const dbp = snap?.health?.bp_diastolic ?? prev?.dbp ?? 80
  const tick = Date.now() / 1000
  const phase = (tick * (hr / 60) * Math.PI * 2) % (Math.PI * 2)
  const ecg =
    Math.sin(phase) * 18 +
    Math.sin(phase * 3) * 6 +
    (Math.sin(phase * 12) > 0.92 ? 55 : 0)
  const activityLevel =
    device.activityLevel === "High" ? 75 : device.activityLevel === "Moderate" ? 45 : 18
  const accel = device.accelerometerG
  return {
    t,
    hr,
    sbp,
    dbp,
    spo2,
    sugar: prev?.sugar ?? 0,
    temp,
    steps: prev?.steps ?? 0,
    roll: prev?.roll ?? 0,
    ecg: Math.round(ecg),
    hrv: device.hrv,
    resp: device.respiratoryRate,
    eda: device.eda ?? prev?.eda ?? 0,
    stress: device.stressIndex,
    accel,
    activityLevel,
    sudden: device.suddenMovement ? 1 : 0,
    immobile: device.prolongedImmobility ? 1 : 0,
  }
}

export function LiveVitalsView({
  initialUserId = null,
  onUserChange,
}: {
  initialUserId?: string | null
  onUserChange?: (userId: string | null) => void
}) {
  const [selectedUser, setSelectedUser] = useState<string | null>(initialUserId)
  const [history, setHistory] = useState<Sample[]>([])
  const [conditions, setConditions] = useState<Record<string, UserCondition>>(() =>
    Object.fromEntries([
      [MY_DEVICE_USER_ID, myDeviceCareUser.condition],
      ...mapPoints.map((p) => [p.id, p.condition] as const),
    ]),
  )
  const [paused, setPaused] = useState(false)
  const tickRef = useRef(0)
  const [tickNow, setTickNow] = useState(() => new Date())
  const watch = useWatchLive(1000)

  useEffect(() => {
    setSelectedUser(initialUserId)
  }, [initialUserId])

  useEffect(() => {
    if (selectedUser) return
    const id = window.setInterval(() => setTickNow(new Date()), 2000)
    return () => window.clearInterval(id)
  }, [selectedUser])

  const selectUser = (id: string | null) => {
    setSelectedUser(id)
    onUserChange?.(id)
    setPaused(false)
  }

  const setUserCondition = (userId: string, c: UserCondition) => {
    setConditions((prev) => ({ ...prev, [userId]: c }))
  }

  const isWatchUser = isMyDeviceUserId(selectedUser)

  const user = useMemo(() => {
    if (!selectedUser) return null
    if (isMyDeviceUserId(selectedUser)) {
      const lat = watch.coords?.lat ?? myDeviceCareUser.lat
      const lng = watch.coords?.lng ?? myDeviceCareUser.lng
      return { ...myDeviceCareUser, lat, lng }
    }
    return mapPoints.find((p) => p.id === selectedUser) ?? null
  }, [selectedUser, watch.coords?.lat, watch.coords?.lng])

  useEffect(() => {
    if (!user) {
      setHistory([])
      return
    }
    tickRef.current = 0
    if (isMyDeviceUserId(user.id)) {
      const seed = sampleFromWatch(null, watch.device, watch.snapshot)
      setHistory(Array.from({ length: 24 }, () => ({ ...seed })))
      return
    }
    const initial: Sample[] = []
    let prev: Sample | null = null
    for (let i = 0; i < 24; i++) {
      prev = nextSample(prev, user.id, user.type, i)
      initial.push(prev)
    }
    setHistory(initial)
  }, [user?.id])

  // Demo users: 1s simulated stream
  useEffect(() => {
    if (!user || paused || isMyDeviceUserId(user.id)) return
    const id = window.setInterval(() => {
      tickRef.current += 1
      setHistory((h) => {
        const last = h[h.length - 1] ?? null
        const next = nextSample(last, user.id, user.type, tickRef.current + 24)
        return [...h.slice(-59), next]
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [user, paused])

  // My Device: append a point whenever watch telemetry refreshes
  useEffect(() => {
    if (!user || paused || !isMyDeviceUserId(user.id)) return
    setHistory((h) => {
      const last = h[h.length - 1] ?? null
      const next = sampleFromWatch(last, watch.device, watch.snapshot)
      if (
        last &&
        last.hr === next.hr &&
        last.spo2 === next.spo2 &&
        last.temp === next.temp &&
        last.sbp === next.sbp &&
        last.dbp === next.dbp
      ) {
        // Still advance time label so the console feels live
        return [...h.slice(-59), { ...next, t: next.t }]
      }
      return [...h.slice(-59), next]
    })
  }, [
    user?.id,
    paused,
    watch.device.heartRate,
    watch.device.spo2,
    watch.device.skinTemperature,
    watch.device.battery,
    watch.device.lastSync,
    watch.snapshot?.health?.bp_systolic,
    watch.snapshot?.health?.bp_diastolic,
    watch.snapshot?.last_seen_at,
  ])

  const live = history[history.length - 1]

  if (!user) {
    return (
      <div className="live-vitals f2s-lv-page space-y-4">
        <LiveSummaryStrip conditions={conditions} now={tickNow} />
        <ConnectedUsersPanel
          conditions={conditions}
          onOpenUser={(id) => selectUser(id)}
          onConditionChange={setUserCondition}
          watchOnline={Boolean(watch.snapshot?.ok && watch.device.connected)}
          watchDevice={watch.device}
        />
      </div>
    )
  }

  if (!live) {
    return (
      <div className="live-vitals f2s-lv-page rounded-2xl border border-[#DCEAF4] bg-white p-8 text-sm text-[#6A8099]">
        Connecting Care Console stream…
      </div>
    )
  }

  return (
    <div className="live-vitals f2s-lv-page">
      <CareConsole
        userId={user.id}
        conditions={conditions}
        history={history}
        live={live}
        paused={paused}
        onPauseToggle={() => setPaused((p) => !p)}
        onSelectUser={(id) => selectUser(id)}
        onBack={() => selectUser(null)}
        onConditionChange={setUserCondition}
        deviceOverride={isWatchUser ? watch.device : undefined}
        watchLive={isWatchUser}
        watchClock={isWatchUser ? watch.snapshot?.clock : null}
        watchStatus={
          isWatchUser
            ? watch.loading && !watch.snapshot?.ok
              ? "Connecting to TCP watch…"
              : watch.snapshot?.ok
                ? `Live TCP watch · IMEI ${watch.snapshot.imei ?? "—"}`
                : watch.error
                  ? `Watch bridge: ${watch.error}`
                  : "Waiting for watch packets…"
            : undefined
        }
      />
    </div>
  )
}
