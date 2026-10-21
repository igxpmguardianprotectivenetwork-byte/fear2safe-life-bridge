import { useEffect, useState } from "react"
import type { ProtectionDevice } from "../data/devices"
import type { WatchLiveSnapshot } from "../lib/supabase"
import { wristStatusLabel } from "../lib/useWatchLive"

type WatchClock = NonNullable<WatchLiveSnapshot["clock"]>

type Props = {
  device: ProtectionDevice
  hr?: number | null
  spo2?: number | null
  temp?: number | null
  sbp?: number | null
  dbp?: number | null
  realtime?: boolean
  clock?: WatchClock | null
  size?: "sm" | "md"
}

function fmt(n: number | null | undefined, digits = 0) {
  if (n == null || !Number.isFinite(n) || n <= 0) return "—"
  return digits ? n.toFixed(digits) : String(Math.round(n))
}

function parseGpsUtc(date?: string | null, time?: string | null): number | null {
  if (!date || !time || !/^\d{6}$/.test(date) || !/^\d{6}$/.test(time)) return null
  const year = 2000 + Number(date.slice(0, 2))
  const month = Number(date.slice(2, 4)) - 1
  const day = Number(date.slice(4, 6))
  const hour = Number(time.slice(0, 2))
  const minute = Number(time.slice(2, 4))
  const second = Number(time.slice(4, 6))
  if (month < 0 || month > 11 || day < 1 || day > 31 || hour > 23 || minute > 59 || second > 59) {
    return null
  }
  const ms = Date.UTC(year, month, day, hour, minute, second)
  return Number.isFinite(ms) ? ms : null
}

/** Watch LCD uses Sri Lanka local time; AP01 gps_time is GMT. */
const WATCH_DISPLAY_TZ = "Asia/Colombo"

function watchUtcMs(clock?: WatchClock | null): number {
  const gpsMs = parseGpsUtc(clock?.gps_date, clock?.gps_time)
  const recMs = clock?.recorded_at ? Date.parse(clock.recorded_at) : Number.NaN
  if (gpsMs == null) return Date.now()
  if (!Number.isFinite(recMs)) return gpsMs
  const age = Date.now() - recMs
  return gpsMs + (age >= 0 && age < 5 * 60_000 ? age : 0)
}

function watchClockParts(clock?: WatchClock | null) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: WATCH_DISPLAY_TZ,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).formatToParts(new Date(watchUtcMs(clock)))
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "—"
  return {
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
    dayPeriod: get("dayPeriod").replace(/\./g, "").toUpperCase(),
  }
}

export function WatchScreenMirror({
  device,
  hr,
  spo2,
  temp,
  sbp,
  dbp,
  realtime = false,
  clock = null,
  size = "md",
}: Props) {
  const [face, setFace] = useState(() => watchClockParts(clock))

  useEffect(() => {
    const tick = () => setFace(watchClockParts(clock))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [clock?.gps_date, clock?.gps_time, clock?.recorded_at])

  const heart = hr ?? device.heartRate
  const oxygen = spo2 ?? device.spo2
  const temperature = temp ?? device.skinTemperature
  const sys = sbp
  const dia = dbp
  const wrist = wristStatusLabel(device.onWrist)
  const live = Boolean(realtime && device.connected)

  return (
    <div
      className={`f2s-watch-mirror is-${size}${device.connected ? "" : " is-offline"}`}
      role="img"
      aria-label={`Live watch screen. Heart rate ${fmt(heart)} bpm. Wrist ${wrist}.`}
    >
      <div className="f2s-watch-bezel">
        <div className="f2s-watch-lcd">
          <div className="f2s-watch-top">
            <span className={`f2s-watch-live${live ? " is-on" : ""}`}>
              <i />
              {live ? "LIVE" : device.connected ? "SYNC" : "OFF"}
            </span>
            <span className="f2s-watch-batt">{Math.round(device.battery)}%</span>
          </div>

          <p className="f2s-watch-clock">
            {face.hour}:{face.minute}
            <span>
              :{face.second} {face.dayPeriod}
            </span>
          </p>

          <p className="f2s-watch-hr">
            {fmt(heart)}
            <small>BPM</small>
          </p>

          <div className="f2s-watch-row">
            <span>
              {sys && dia ? `${fmt(sys)}/${fmt(dia)}` : "—/—"}
              <small>BP</small>
            </span>
            <span>
              {fmt(oxygen)}
              <small>SpO₂</small>
            </span>
            <span>
              {fmt(temperature, 1)}
              <small>°C</small>
            </span>
          </div>

          <p className={`f2s-watch-wrist${device.onWrist === false ? " is-off" : ""}`}>{wrist}</p>
        </div>
      </div>
      <p className="f2s-watch-caption">Realtime screen · watch packets</p>
    </div>
  )
}
