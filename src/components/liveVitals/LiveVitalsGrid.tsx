import { useMemo, type CSSProperties } from "react"
import {
  Activity,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  Brain,
  Clock3,
  Droplets,
  Heart,
  MapPin,
  MoreVertical,
  ShieldCheck,
  Siren,
  TriangleAlert,
  UsersRound,
  Wifi,
} from "lucide-react"
import { mapPoints, type UserCondition } from "../../data/mock"
import { monitoredDevices, myDevice, protectionDevices } from "../../data/devices"
import { UserAvatar } from "../UserAvatar"

export const liveStatusTheme: Record<
  UserCondition,
  { label: string; color: string; soft: string; btnBg: string }
> = {
  safe: {
    label: "SAFE",
    color: "#14B882",
    soft: "#ECFBF5",
    btnBg: "#ECFBF5",
  },
  verify: {
    label: "VERIFICATION",
    color: "#3478F6",
    soft: "#EAF1FE",
    btnBg: "#EAF1FE",
  },
  attention: {
    label: "ATTENTION",
    color: "#F5A214",
    soft: "#FFF8E9",
    btnBg: "#FFF8E9",
  },
  emergency: {
    label: "EMERGENCY / SOS",
    color: "#F2385A",
    soft: "#FFF1F4",
    btnBg: "#FFF1F4",
  },
}

export function deviceForUser(userId: string) {
  if (userId === "self" || userId === "own" || userId === "p6") {
    return myDevice
  }
  const idx = mapPoints.findIndex((p) => p.id === userId)
  return idx >= 0 ? monitoredDevices[idx] : monitoredDevices[0] ?? myDevice
}

function SignalBars({ strength }: { strength: "Strong" | "Fair" | "Weak" }) {
  const lit = strength === "Strong" ? 4 : strength === "Fair" ? 3 : 2
  return (
    <span className="f2s-lv-signal" aria-label={`Signal ${strength}`} title={`Signal ${strength}`}>
      {[1, 2, 3, 4].map((i) => (
        <span key={i} className={i <= lit ? "is-on" : ""} style={{ height: `${6 + i * 3}px` }} />
      ))}
    </span>
  )
}

function BatteryIcon({ pct }: { pct: number }) {
  if (pct > 70) return <BatteryFull className="h-3.5 w-3.5" />
  if (pct > 25) return <BatteryMedium className="h-3.5 w-3.5" />
  return <BatteryLow className="h-3.5 w-3.5" />
}

/** Six clearly different smooth wave profiles (one per connected user). */
const WAVE_PROFILES = [
  {
    // emergency-style: dense, tall, fast scroll
    id: "urgent",
    cycles: 7,
    duration: 3.8,
    amp: 20,
    sharpness: 4,
    secondAmp: 10,
    secondPhase: 0.25,
    wobble: 3.2,
    wobbleFreq: 2.4,
  },
  {
    // calm wide beats
    id: "calm-a",
    cycles: 2.2,
    duration: 16,
    amp: 12,
    sharpness: 12,
    secondAmp: 3,
    secondPhase: 0.7,
    wobble: 0.8,
    wobbleFreq: 0.4,
  },
  {
    // soft sine undulation
    id: "calm-b",
    cycles: 2.8,
    duration: 13.5,
    amp: 10,
    sharpness: 9,
    secondAmp: 4.5,
    secondPhase: 0.55,
    wobble: 1.6,
    wobbleFreq: 0.9,
  },
  {
    // verification: medium dual-peak
    id: "steady",
    cycles: 3.4,
    duration: 10,
    amp: 14,
    sharpness: 7,
    secondAmp: 6,
    secondPhase: 0.4,
    wobble: 1.8,
    wobbleFreq: 1.2,
  },
  {
    // attention: elevated cadence
    id: "elevated",
    cycles: 5,
    duration: 6.2,
    amp: 17,
    sharpness: 5.5,
    secondAmp: 8,
    secondPhase: 0.3,
    wobble: 2.6,
    wobbleFreq: 1.8,
  },
  {
    // my-device calm: sparse soft rollers
    id: "calm-c",
    cycles: 1.8,
    duration: 18,
    amp: 11,
    sharpness: 14,
    secondAmp: 2.5,
    secondPhase: 0.85,
    wobble: 1.1,
    wobbleFreq: 0.3,
  },
] as const

function buildPulsePath(
  profile: (typeof WAVE_PROFILES)[number],
  seed: number,
) {
  const w = 320
  const h = 56
  const steps = 160
  const pts: string[] = []

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w
    const t = (i / steps) * Math.PI * 2 * profile.cycles + seed * 0.17
    const beat = Math.pow(Math.max(0, Math.sin(t)), profile.sharpness) * profile.amp
    const second =
      Math.pow(Math.max(0, Math.sin(t - profile.secondPhase)), profile.sharpness * 0.7) *
      profile.secondAmp
    const wobble = Math.sin(t * profile.wobbleFreq + seed * 0.2) * profile.wobble
    const y = h / 2 - beat - second - wobble
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`)
  }
  return { w, h, points: pts.join(" ") }
}

function MiniPulseWaveform({
  color,
  userId,
}: {
  color: string
  userId: string
}) {
  const index = Math.max(
    0,
    mapPoints.findIndex((p) => p.id === userId),
  )
  const profile = WAVE_PROFILES[index % WAVE_PROFILES.length]
  const seed = userId.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  const path = useMemo(() => buildPulsePath(profile, seed), [profile, seed])

  return (
    <div className="f2s-lv-wave" aria-hidden data-wave={profile.id}>
      <div
        className="f2s-lv-wave-track"
        style={
          {
            "--f2s-wave-duration": `${profile.duration}s`,
          } as CSSProperties
        }
      >
        <svg
          viewBox={`0 0 ${path.w} ${path.h}`}
          preserveAspectRatio="none"
          className="f2s-lv-wave-svg"
        >
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={path.points}
          />
        </svg>
        <svg
          viewBox={`0 0 ${path.w} ${path.h}`}
          preserveAspectRatio="none"
          className="f2s-lv-wave-svg"
          aria-hidden
        >
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={path.points}
          />
        </svg>
      </div>
    </div>
  )
}

export function LiveSummaryStrip({
  conditions,
  now,
}: {
  conditions: Record<string, UserCondition>
  now: Date
}) {
  const counts = useMemo(() => {
    const c = { safe: 0, verify: 0, attention: 0, emergency: 0 }
    mapPoints.forEach((p) => {
      const key = conditions[p.id] ?? p.condition
      c[key] += 1
    })
    return c
  }, [conditions])

  const avgHr = useMemo(() => {
    const sum = protectionDevices.reduce((s, d) => s + d.heartRate, 0)
    return Math.round(sum / Math.max(protectionDevices.length, 1))
  }, [])

  const syncPct = Math.round(
    (protectionDevices.filter((d) => d.connected).length / Math.max(protectionDevices.length, 1)) *
      100,
  )

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const items = [
    {
      key: "nodes",
      label: "Total Live Nodes",
      value: String(mapPoints.length),
      icon: <UsersRound className="h-3.5 w-3.5" />,
      tone: "teal" as const,
      extra: <span className="f2s-lv-live-pill">LIVE</span>,
    },
    {
      key: "safe",
      label: "Safe",
      value: String(counts.safe),
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      tone: "green" as const,
    },
    {
      key: "attention",
      label: "Attention",
      value: String(counts.attention),
      icon: <TriangleAlert className="h-3.5 w-3.5" />,
      tone: "orange" as const,
    },
    {
      key: "verify",
      label: "Verification",
      value: String(counts.verify),
      icon: <Clock3 className="h-3.5 w-3.5" />,
      tone: "blue" as const,
    },
    {
      key: "sos",
      label: "Emergency / SOS",
      value: String(counts.emergency),
      icon: <Siren className="h-3.5 w-3.5" />,
      tone: "red" as const,
    },
    {
      key: "hr",
      label: "Avg. Heart Rate",
      value: `${avgHr} bpm`,
      icon: <Heart className="h-3.5 w-3.5" />,
      tone: "pink" as const,
      spark: true,
    },
    {
      key: "sync",
      label: "Network Sync",
      value: `${syncPct}%`,
      icon: <Brain className="h-3.5 w-3.5" />,
      tone: "cyan" as const,
    },
    {
      key: "updated",
      label: "Last Updated",
      value: time,
      icon: <Clock3 className="h-3.5 w-3.5" />,
      tone: "blue" as const,
      sub: "2s ago",
    },
  ]

  return (
    <div className="f2s-lv-summary" role="region" aria-label="Live network telemetry">
      {items.map((item) => (
        <div key={item.key} className={`f2s-lv-summary-item tone-${item.tone}`}>
          <span className="f2s-lv-summary-icon">{item.icon}</span>
          <div className="min-w-0">
            <div className="f2s-lv-summary-value-row">
              <p className="f2s-lv-summary-value">{item.value}</p>
              {"extra" in item ? item.extra : null}
            </div>
            <p className="f2s-lv-summary-label">{item.label}</p>
            {"sub" in item && item.sub ? <p className="f2s-lv-summary-sub">{item.sub}</p> : null}
          </div>
          {"spark" in item && item.spark ? (
            <span className="f2s-lv-mini-bars" aria-hidden>
              {[4, 7, 5, 9, 6, 8, 5].map((h, i) => (
                <i key={i} style={{ height: `${h}px` }} />
              ))}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  )
}

function LiveUserCard({
  userId,
  label,
  nodeId,
  condition,
  onOpen,
  onConditionChange,
}: {
  userId: string
  label: string
  nodeId: string
  condition: UserCondition
  onOpen: () => void
  onConditionChange: (c: UserCondition) => void
}) {
  const theme = liveStatusTheme[condition]
  const device = deviceForUser(userId)
  const jagged = condition === "emergency" || condition === "attention"
  const activityLabel =
    device.activityLevel === "Low"
      ? "Low Activity"
      : device.activityLevel === "High"
        ? "High Activity"
        : device.activity === "Normal"
          ? "Normal"
          : device.activity

  return (
    <article
      className={`f2s-lv-card status-${condition}`}
      style={
        {
          "--lv-status": theme.color,
          "--lv-soft": theme.soft,
          "--lv-btn": theme.btnBg,
        } as CSSProperties
      }
    >
      <div className="f2s-lv-card-head">
        <div className="f2s-lv-card-who">
          <div className="f2s-lv-avatar-wrap">
            <UserAvatar userId={userId} label={label} size="md" />
            <span className="f2s-lv-online-dot" style={{ background: theme.color }} />
          </div>
          <div className="min-w-0">
            <p className="f2s-lv-node-id">{nodeId}</p>
            <h3 className="f2s-lv-name">{label}</h3>
            <span className="f2s-lv-badge" style={{ color: theme.color, background: theme.soft }}>
              {theme.label}
            </span>
          </div>
        </div>
        <div className="f2s-lv-card-meta">
          <SignalBars strength={device.signalStrength} />
          <span className="f2s-lv-battery" title={`Battery ${device.battery}%`}>
            <BatteryIcon pct={device.battery} />
            {device.battery}%
          </span>
          <button
            type="button"
            className="f2s-lv-more"
            aria-label={`More options for ${label}`}
            onClick={(e) => {
              e.stopPropagation()
              const next =
                condition === "safe"
                  ? "verify"
                  : condition === "verify"
                    ? "attention"
                    : condition === "attention"
                      ? "emergency"
                      : "safe"
              onConditionChange(next)
            }}
            title="Cycle protection status (demo)"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="f2s-lv-card-body">
        <div className="f2s-lv-metrics">
          <div>
            <Heart className="h-3.5 w-3.5" style={{ color: theme.color }} />
            <p>
              <strong style={{ color: jagged ? theme.color : undefined }}>{device.heartRate}</strong>{" "}
              bpm
            </p>
          </div>
          <div>
            <Droplets className="h-3.5 w-3.5 text-[#149FE8]" />
            <p>
              <strong>{device.spo2}%</strong> SpO₂
            </p>
          </div>
          <div>
            <Activity className="h-3.5 w-3.5" style={{ color: theme.color }} />
            <p>
              <strong>{activityLabel}</strong>
            </p>
          </div>
        </div>
        <div className="f2s-lv-wave-wrap">
          <MiniPulseWaveform color={theme.color} userId={userId} />
          <p className="f2s-lv-wave-meta">Live · {device.lastSync}</p>
        </div>
      </div>

      <div className="f2s-lv-card-foot">
        <div className="f2s-lv-stream">
          <span>
            <span className="dot" /> Bio Stream Active
          </span>
          <span>
            <MapPin className="h-3 w-3" /> GPS On
          </span>
          <span>
            <Wifi className="h-3 w-3" /> {device.connected ? "Device Online" : "Offline"}
          </span>
        </div>
        <button type="button" className="f2s-lv-open" onClick={onOpen}>
          Open Console →
        </button>
      </div>
    </article>
  )
}

export function ConnectedUsersPanel({
  conditions,
  onOpenUser,
  onConditionChange,
}: {
  conditions: Record<string, UserCondition>
  onOpenUser: (id: string) => void
  onConditionChange: (id: string, c: UserCondition) => void
}) {
  return (
    <section className="f2s-lv-panel">
      <div className="f2s-lv-panel-head">
        <div className="f2s-lv-panel-title">
          <span className="f2s-lv-sec-icon">
            <UsersRound className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2>Connected Users ({mapPoints.length})</h2>
            <p>
              Select a user to open live Care Console, watch vitals, graphs, and streaming metrics.
            </p>
          </div>
        </div>
        <div className="f2s-lv-legend" aria-label="Status legend">
          {(
            [
              ["safe", "Safe"],
              ["verify", "Verification"],
              ["attention", "Attention"],
              ["emergency", "Emergency / SOS"],
            ] as const
          ).map(([k, label]) => (
            <span key={k}>
              <i style={{ background: liveStatusTheme[k].color }} />
              {label}
            </span>
          ))}
        </div>
        <span className="f2s-lv-nodes-badge">
          <span className="dot" />
          {mapPoints.length} NODES · LIVE
        </span>
      </div>

      <div className="f2s-lv-grid">
        {mapPoints.map((u) => (
          <LiveUserCard
            key={u.id}
            userId={u.id}
            label={u.label}
            nodeId={u.nodeId}
            condition={conditions[u.id] ?? u.condition}
            onOpen={() => onOpenUser(u.id)}
            onConditionChange={(c) => onConditionChange(u.id, c)}
          />
        ))}
      </div>
    </section>
  )
}

export function SystemStatusVisual() {
  return (
    <div className="f2s-lv-sys" aria-label="System status">
      <div className="f2s-lv-sys-orbits" aria-hidden>
        <span />
        <span />
        <span />
        <div className="f2s-lv-sys-shield">
          <ShieldCheck className="h-5 w-5" />
        </div>
      </div>
      <div className="min-w-0">
        <p className="f2s-lv-sys-title">All Systems Operational</p>
        <p className="f2s-lv-sys-sub">Monitoring · Alerts · Guardians</p>
      </div>
    </div>
  )
}
