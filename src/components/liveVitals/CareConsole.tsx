import { useMemo, useState, type CSSProperties, type ReactNode } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Activity,
  ArrowLeft,
  BatteryMedium,
  Clock3,
  Droplets,
  Footprints,
  Heart,
  LocateFixed,
  MapPin,
  MessageCircle,
  Pause,
  Phone,
  Plus,
  Route,
  Share2,
  ShieldCheck,
  Signal,
  Thermometer,
  TriangleAlert,
  Watch,
  Waves,
  Wifi,
  Wind,
} from "lucide-react"
import { Link } from "react-router-dom"
import { mapPoints, type UserCondition } from "../../data/mock"
import { myDeviceCareUser, isMyDeviceUserId } from "../../data/careUsers"
import type { ProtectionDevice } from "../../data/devices"
import { UserAvatar } from "../UserAvatar"
import { deviceForUser, liveStatusTheme } from "./LiveVitalsGrid"
import { WatchScreenMirror } from "../WatchScreenMirror"
import type { WatchLiveSnapshot } from "../../lib/supabase"

const careUsers = [myDeviceCareUser, ...mapPoints]

export type CareSample = {
  t: string
  hr: number
  sbp: number
  dbp: number
  spo2: number
  sugar: number
  temp: number
  steps: number
  roll: number
  ecg: number
  hrv: number
  resp: number
  eda: number
  stress: number
  accel: number
  activityLevel: number
  sudden: number
  immobile: number
}

type ConsoleTab = "Live Graphs" | "Summary" | "Body-State" | "Activity & Movement" | "Context & Events"

function statsOf(data: CareSample[], key: keyof CareSample) {
  const vals = data.map((d) => Number(d[key])).filter((n) => Number.isFinite(n))
  if (!vals.length) return { max: 0, min: 0, avg: 0 }
  const max = Math.max(...vals)
  const min = Math.min(...vals)
  const avg = Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
  return { max, min, avg }
}

function MiniSpark({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 0.001)
  const min = Math.min(...values)
  const range = Math.max(max - min, 0.001)
  const w = 56
  const h = 22
  const pts = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * w
      const y = h - ((v - min) / range) * (h - 4) - 2
      return `${x},${y}`
    })
    .join(" ")
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <polyline fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" points={pts} />
    </svg>
  )
}

function CompactGraph({
  title,
  value,
  unit,
  color,
  data,
  dataKey,
  domain,
  area,
  source,
}: {
  title: string
  value: string
  unit: string
  color: string
  data: CareSample[]
  dataKey: keyof CareSample
  domain?: [number, number]
  area?: boolean
  source?: string
}) {
  const st = statsOf(data, dataKey)
  return (
    <article className="f2s-cc-graph">
      <div className="f2s-cc-graph-left">
        <p className="f2s-cc-graph-title">{title}</p>
        <p className="f2s-cc-graph-value">
          {value}
          <span>{unit}</span>
        </p>
        {source ? <p className="f2s-cc-source">{source}</p> : null}
        <span className="f2s-cc-live">
          <i style={{ background: color }} /> LIVE
        </span>
      </div>
      <div className="f2s-cc-graph-chart">
        <ResponsiveContainer width="100%" height="100%">
          {area ? (
            <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`cc-${String(dataKey)}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F1F7" vertical={false} />
              <XAxis dataKey="t" tick={{ fontSize: 9, fill: "#6A8099" }} minTickGap={36} axisLine={false} tickLine={false} />
              <YAxis
                domain={domain ?? ["auto", "auto"]}
                tick={{ fontSize: 9, fill: "#6A8099" }}
                width={28}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={{ borderRadius: 10, borderColor: "#DCEAF4", fontSize: 11 }} />
              <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#cc-${String(dataKey)})`} strokeWidth={1.8} isAnimationActive={false} />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8F1F7" vertical={false} />
              <XAxis dataKey="t" tick={{ fontSize: 9, fill: "#6A8099" }} minTickGap={36} axisLine={false} tickLine={false} />
              <YAxis
                domain={domain ?? ["auto", "auto"]}
                tick={{ fontSize: 9, fill: "#6A8099" }}
                width={28}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={{ borderRadius: 10, borderColor: "#DCEAF4", fontSize: 11 }} />
              <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.8} dot={false} isAnimationActive={false} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      <div className="f2s-cc-graph-stats">
        <div>
          <span>Max</span>
          <strong>
            {st.max}
            {unit ? ` ${unit}` : ""}
          </strong>
        </div>
        <div>
          <span>Min</span>
          <strong>
            {st.min}
            {unit ? ` ${unit}` : ""}
          </strong>
        </div>
        <div>
          <span>Avg</span>
          <strong>
            {st.avg}
            {unit ? ` ${unit}` : ""}
          </strong>
        </div>
      </div>
    </article>
  )
}

export function CareConsole({
  userId,
  conditions,
  history,
  live,
  paused,
  onPauseToggle,
  onSelectUser,
  onBack,
  onConditionChange,
  deviceOverride,
  watchLive = false,
  watchStatus,
  watchClock = null,
}: {
  userId: string
  conditions: Record<string, UserCondition>
  history: CareSample[]
  live: CareSample
  paused: boolean
  onPauseToggle: () => void
  onSelectUser: (id: string) => void
  onBack: () => void
  onConditionChange: (id: string, c: UserCondition) => void
  deviceOverride?: ProtectionDevice
  watchLive?: boolean
  watchStatus?: string
  watchClock?: WatchLiveSnapshot["clock"]
}) {
  const [tab, setTab] = useState<ConsoleTab>("Live Graphs")
  const [range, setRange] = useState<"Live" | "1H" | "6H" | "24H">("Live")
  const user = careUsers.find((p) => p.id === userId) ?? myDeviceCareUser
  const cond = conditions[userId] ?? user.condition
  const theme = liveStatusTheme[cond]
  const device = deviceOverride ?? deviceForUser(userId)
  const chartData = paused ? history : history
  const onlineCount = careUsers.length
  const isOwn = isMyDeviceUserId(userId)

  const hrSpark = useMemo(() => history.slice(-12).map((h) => h.hr), [history])
  const spo2Spark = useMemo(() => history.slice(-12).map((h) => h.spo2), [history])
  const tempSpark = useMemo(() => history.slice(-12).map((h) => h.temp), [history])
  const hrvSpark = useMemo(() => history.slice(-12).map((h) => h.hrv), [history])
  const respSpark = useMemo(() => history.slice(-12).map((h) => h.resp), [history])
  const stepSpark = useMemo(() => history.slice(-12).map((h) => h.steps % 100), [history])

  const statusCopy =
    cond === "emergency"
      ? "Emergency / SOS active — prioritize guardian response."
      : cond === "attention"
        ? "Attention required — monitoring closely for anomalies."
        : cond === "verify"
          ? "Verification in progress — Monitoring closely for anomalies."
          : "Protected — Normal monitoring active."

  const summaryMetrics: {
    label: string
    value: string
    unit: string
    color: string
    icon: ReactNode
    spark: number[]
  }[] = [
    {
      label: "Heart Rate",
      value: String(live.hr),
      unit: "bpm",
      color: "#FF4D67",
      icon: <Heart className="h-3.5 w-3.5" />,
      spark: hrSpark,
    },
    {
      label: "SpO₂",
      value: String(live.spo2),
      unit: "%",
      color: "#149FE8",
      icon: <Droplets className="h-3.5 w-3.5" />,
      spark: spo2Spark,
    },
    {
      label: "Skin Temperature",
      value: String(live.temp),
      unit: "°C",
      color: "#F5A214",
      icon: <Thermometer className="h-3.5 w-3.5" />,
      spark: tempSpark,
    },
    {
      label: "HRV",
      value: String(live.hrv),
      unit: "ms",
      color: "#8A63F6",
      icon: <Activity className="h-3.5 w-3.5" />,
      spark: hrvSpark,
    },
    {
      label: "Respiratory Rate",
      value: String(live.resp),
      unit: "/min",
      color: "#20C7E8",
      icon: <Wind className="h-3.5 w-3.5" />,
      spark: respSpark,
    },
    {
      label: "Pulse / PPG",
      value: "Live",
      unit: "",
      color: "#20D9FF",
      icon: <Waves className="h-3.5 w-3.5" />,
      spark: hrSpark,
    },
    {
      label: "Steps today",
      value: live.steps.toLocaleString(),
      unit: "",
      color: "#22C55E",
      icon: <Footprints className="h-3.5 w-3.5" />,
      spark: stepSpark,
    },
  ]

  if (device.edaSupported && device.eda != null) {
    summaryMetrics.splice(6, 0, {
      label: "EDA",
      value: String(live.eda),
      unit: "µS",
      color: "#12B981",
      icon: <Activity className="h-3.5 w-3.5" />,
      spark: history.slice(-12).map((h) => h.eda),
    })
  }

  const tabs: ConsoleTab[] = [
    "Live Graphs",
    "Summary",
    "Body-State",
    "Activity & Movement",
    "Context & Events",
  ]

  const ownStatusCopy = watchLive
    ? "Live TCP watch telemetry — vitals update as packets arrive."
    : watchStatus ?? "Waiting for watch packets from the TCP bridge."

  return (
    <div className="f2s-cc-page">
      <div className="f2s-cc-controls">
        <button type="button" className="f2s-cc-back" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          All users
        </button>
        <div className="f2s-cc-ranges">
          {(["Live", "1H", "6H", "24H"] as const).map((r) => (
            <button
              key={r}
              type="button"
              disabled={r !== "Live"}
              title={r !== "Live" ? "Historical ranges available when stored vitals exist." : "Live stream"}
              className={range === r ? "is-active" : ""}
              onClick={() => r === "Live" && setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
        <button type="button" className="f2s-cc-export" disabled title="Export available when export API is connected.">
          Export Data
        </button>
      </div>

      <div className="f2s-cc-grid">
        {/* LEFT */}
        <aside className="f2s-cc-users">
          <div className="f2s-cc-users-head">
            <h2>Connected Users</h2>
            <p>
              {onlineCount}/{onlineCount} Online
            </p>
          </div>
          <ul>
            {careUsers.map((u) => {
              const c = conditions[u.id] ?? u.condition
              const t = liveStatusTheme[c]
              const active = u.id === userId
              const own = isMyDeviceUserId(u.id)
              return (
                <li key={u.id}>
                  <button
                    type="button"
                    className={`f2s-cc-user ${active ? "is-active" : ""}`}
                    onClick={() => onSelectUser(u.id)}
                    style={{ "--cc-accent": t.color } as CSSProperties}
                  >
                    {own ? (
                      <span className="f2s-cc-own-avatar" aria-hidden>
                        AH
                      </span>
                    ) : (
                      <UserAvatar userId={u.id} label={u.label} size="sm" />
                    )}
                    <span className="min-w-0 flex-1 text-left">
                      <strong>{u.label}</strong>
                      <em style={{ color: own ? "#007F86" : t.color, background: own ? "#EAF6FD" : t.soft }}>
                        {own ? "MY WATCH" : t.label}
                      </em>
                    </span>
                    <Signal className="h-3.5 w-3.5 text-[#14B882]" />
                  </button>
                </li>
              )
            })}
          </ul>
          <button type="button" className="f2s-cc-add-user" disabled title="Invite flow not connected">
            <Plus className="h-3.5 w-3.5" /> Add User
          </button>
        </aside>

        {/* CENTER */}
        <section className="f2s-cc-center">
          <div className={`f2s-cc-selected${isOwn ? " has-mirror" : ""}`}>
            <div className="f2s-cc-selected-who">
              {isOwn ? (
                <span className="f2s-cc-own-avatar is-lg" aria-hidden>
                  AH
                </span>
              ) : (
                <UserAvatar userId={user.id} label={user.label} size="md" />
              )}
              <div className="min-w-0">
                <h3>{user.label}</h3>
                <p>
                  {isOwn
                    ? `${device.serial} · TCP Watch`
                    : `${user.nodeId} · Wearable Device`}
                </p>
                {watchStatus ? <p className="f2s-cc-watch-status">{watchStatus}</p> : null}
                <button
                  type="button"
                  className="f2s-cc-badge"
                  style={{ color: theme.color, background: theme.soft }}
                  onClick={() => {
                    const order: UserCondition[] = ["safe", "verify", "attention", "emergency"]
                    const i = order.indexOf(cond)
                    onConditionChange(userId, order[(i + 1) % order.length])
                  }}
                  title="Cycle status (demo)"
                >
                  {isOwn ? (watchLive ? "LIVE WATCH" : theme.label) : theme.label}
                </button>
              </div>
            </div>
            {isOwn ? (
              <WatchScreenMirror
                device={device}
                hr={live.hr}
                spo2={live.spo2}
                temp={live.temp}
                sbp={live.sbp}
                dbp={live.dbp}
                realtime={watchLive}
                clock={watchClock}
                size="sm"
              />
            ) : null}
            <div className="f2s-cc-tiles">
              <div>
                <Wifi className="h-3.5 w-3.5" />
                <p>{device.connected ? "Device Online" : "Device Offline"}</p>
                <strong>{device.lastSync}</strong>
              </div>
              {isOwn ? (
                <div className={device.onWrist === false ? "is-off-wrist" : ""}>
                  <Watch className="h-3.5 w-3.5" />
                  <p>Wrist</p>
                  <strong>
                    {device.onWrist === true
                      ? "On wrist"
                      : device.onWrist === false
                        ? "Off wrist"
                        : "Unknown"}
                  </strong>
                </div>
              ) : null}
              <div>
                <BatteryMedium className="h-3.5 w-3.5" />
                <p>Battery</p>
                <strong>{device.battery}%</strong>
              </div>
              <div>
                <Signal className="h-3.5 w-3.5" />
                <p>Signal</p>
                <strong>{device.signalStrength}</strong>
              </div>
              <div>
                <MapPin className="h-3.5 w-3.5" />
                <p>Location</p>
                <strong>
                  {isOwn && device.location.startsWith("Live GPS")
                    ? device.location.replace("Live GPS · ", "")
                    : `${user.lat.toFixed(5)}, ${user.lng.toFixed(5)}`}
                </strong>
              </div>
            </div>
            <Link to="/device" className="f2s-cc-device-btn">
              Device Details →
            </Link>
          </div>

          <div className="f2s-cc-summary">
            {summaryMetrics.map((m) => (
              <article key={m.label} className="f2s-cc-metric">
                <span className="f2s-cc-metric-icon" style={{ color: m.color, background: `${m.color}18` }}>
                  {m.icon}
                </span>
                <p className="f2s-cc-metric-value" style={{ color: m.color }}>
                  {m.value}
                  {m.unit ? <span>{m.unit}</span> : null}
                </p>
                <p className="f2s-cc-metric-label">{m.label}</p>
                <MiniSpark values={m.spark} color={m.color} />
              </article>
            ))}
          </div>

          <div className="f2s-cc-tabs-bar">
            <div className="f2s-cc-tabs" role="tablist">
              {tabs.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  className={tab === t ? "is-active" : ""}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="f2s-cc-stream-controls">
              <button type="button" onClick={onPauseToggle} title="Pause chart display">
                <Pause className="h-3.5 w-3.5" />
                {paused ? "Resume" : "Pause"}
              </button>
              <span className="f2s-cc-rt">
                <i /> {watchLive ? "Watch · ~4s" : "Real-time · 1s"}
              </span>
            </div>
          </div>

          {tab === "Live Graphs" && (
            <div className="f2s-cc-graphs">
              <CompactGraph
                title="Heart Rate"
                value={String(live.hr)}
                unit="bpm"
                color="#FF4D67"
                data={chartData}
                dataKey="hr"
                source="Wearable"
              />
              <CompactGraph
                title="SpO₂ · Blood Oxygen"
                value={String(live.spo2)}
                unit="%"
                color="#20C7E8"
                data={chartData}
                dataKey="spo2"
                domain={[88, 100]}
                area
                source="Wearable"
              />
              <CompactGraph
                title="Skin Temperature"
                value={String(live.temp)}
                unit="°C"
                color="#12B981"
                data={chartData}
                dataKey="temp"
                domain={[35.5, 38]}
                source="Wearable"
              />
              <CompactGraph
                title="HRV"
                value={String(live.hrv)}
                unit="ms"
                color="#8A63F6"
                data={chartData}
                dataKey="hrv"
                source="Wearable"
              />
              <CompactGraph
                title="Respiratory Rate"
                value={String(live.resp)}
                unit="/min"
                color="#149FE8"
                data={chartData}
                dataKey="resp"
                source="Derived"
              />
              <CompactGraph
                title="Pulse / PPG Waveform"
                value="Live"
                unit=""
                color="#20D9FF"
                data={chartData}
                dataKey="ecg"
                source="Wearable optical"
              />
              <CompactGraph
                title="Motion / Accelerometer"
                value={String(live.accel)}
                unit="g"
                color="#7467FF"
                data={chartData}
                dataKey="accel"
                source="Wearable"
              />
            </div>
          )}

          {tab === "Summary" && (
            <div className="f2s-cc-panel-block">
              <h4>Wearable summary</h4>
              <div className="f2s-cc-body-grid">
                {[
                  ["Heart Rate", `${live.hr} bpm`],
                  ["SpO₂", `${live.spo2}%`],
                  ["Skin Temp", `${live.temp}°C`],
                  ["HRV", `${live.hrv} ms`],
                  ["Respiration", `${live.resp}/min`],
                  ["Steps", live.steps.toLocaleString()],
                  ["Stress index", `${live.stress}/100`],
                  ["Activity", `${live.activityLevel}%`],
                ].map(([k, v]) => (
                  <div key={k}>
                    <span>{k}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
              <h4 className="mt">{isOwn ? "Watch extras" : "Optional / demo sensors"}</h4>
              <p className="f2s-cc-note">
                {isOwn
                  ? "Blood pressure comes from the TCP watch health packet when reported."
                  : "Not measured by the Fear2Safe Health Band. Shown only as demo / external placeholders."}
              </p>
              <div className="f2s-cc-demo-row">
                <div>
                  <em>{isOwn ? "WATCH" : "DEMO"}</em>
                  <p>Blood Pressure</p>
                  <strong>
                    {live.sbp}/{live.dbp} mmHg
                  </strong>
                </div>
                {!isOwn ? (
                  <>
                    <div>
                      <em>DEMO</em>
                      <p>Blood Glucose</p>
                      <strong>{live.sugar} mg/dL</strong>
                    </div>
                    <div>
                      <em>DEMO</em>
                      <p>ECG (not available)</p>
                      <strong>Use PPG above</strong>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          )}

          {tab === "Body-State" && (
            <div className="f2s-cc-body-grid f2s-cc-body-grid--4">
              {[
                ["Accelerometer", `${live.accel} g`],
                ["Activity Level", `${live.activityLevel}%`],
                ["Sudden Movement", live.sudden ? "Detected" : "Clear"],
                ["Prolonged Immobility", live.immobile ? "Yes" : "No"],
                ["Locomotion", live.activityLevel > 70 ? "Running" : live.activityLevel > 35 ? "Walking" : "Still"],
                ["Fall / Impact", live.accel > 1.6 ? "Check" : "Clear"],
                ["Struggle Pattern", live.sudden && live.stress > 50 ? "Flag" : "Clear"],
                ["Posture change", device.postureChange ? "Yes" : "Stable"],
              ].map(([k, v]) => (
                <div key={k}>
                  <span>{k}</span>
                  <strong>{v}</strong>
                </div>
              ))}
            </div>
          )}

          {tab === "Activity & Movement" && (
            <div className="f2s-cc-graphs">
              <CompactGraph
                title="Steps"
                value={live.steps.toLocaleString()}
                unit=""
                color="#22C55E"
                data={chartData}
                dataKey="steps"
                area
                source="Wearable"
              />
              <CompactGraph
                title="Activity Level"
                value={String(live.activityLevel)}
                unit="%"
                color="#14B882"
                data={chartData}
                dataKey="activityLevel"
                domain={[0, 100]}
                area
                source="Wearable"
              />
              <CompactGraph
                title="Motion Frequency"
                value={String(live.roll)}
                unit="Hz"
                color="#7467FF"
                data={chartData}
                dataKey="roll"
                source="Wearable"
              />
            </div>
          )}

          {tab === "Context & Events" && (
            <div className="f2s-cc-panel-block">
              <h4>Protection context</h4>
              <ul className="f2s-cc-events">
                <li>
                  <Clock3 className="h-3.5 w-3.5" />
                  <div>
                    <strong>Status: {theme.label}</strong>
                    <p>{statusCopy}</p>
                  </div>
                </li>
                <li>
                  <MapPin className="h-3.5 w-3.5" />
                  <div>
                    <strong>Location</strong>
                    <p>
                      {user.lat.toFixed(5)}, {user.lng.toFixed(5)} · {device.location}
                    </p>
                  </div>
                </li>
                <li>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <div>
                    <strong>{device.safeZone ? "Within safe zone" : "Outside safe zone"}</strong>
                    <p>{device.protectionState} · Monitoring {device.monitoringActive ? "active" : "paused"}</p>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </section>

        {/* RIGHT */}
        <aside className="f2s-cc-right">
          <div className="f2s-cc-card">
            <h3>Current Status</h3>
            <p className="f2s-cc-right-name">{user.label}</p>
            <span
              className="f2s-cc-badge"
              style={{
                color: isOwn && watchLive ? "#007F86" : theme.color,
                background: isOwn && watchLive ? "#EAF6FD" : theme.soft,
              }}
            >
              {isOwn ? (watchLive ? "LIVE WATCH" : theme.label) : theme.label}
            </span>
            <div
              className="f2s-cc-status-box"
              style={{
                borderColor: `${isOwn && watchLive ? "#007F86" : theme.color}44`,
                background: isOwn && watchLive ? "#EAF6FD" : theme.soft,
              }}
            >
              <p>
                {isOwn
                  ? watchLive
                    ? "TCP watch connected"
                    : "Watch bridge"
                  : cond === "verify"
                    ? "Verification in progress"
                    : theme.label}
              </p>
              <span>{isOwn ? ownStatusCopy : statusCopy}</span>
            </div>
          </div>

          <div className="f2s-cc-card">
            <h3>Location & Safe Zone</h3>
            <div className="f2s-cc-mini-map" aria-hidden>
              <span className="zone" />
              <span className="pin" />
            </div>
            <p className="f2s-cc-loc">
              <LocateFixed className="h-3.5 w-3.5" />
              {user.lat.toFixed(5)}, {user.lng.toFixed(5)}
            </p>
            <p className="f2s-cc-acc">Accuracy: {device.gpsAccuracy === "High" ? "8 m" : "25 m"}</p>
            <div className={`f2s-cc-zone-pill ${device.safeZone ? "in" : "out"}`}>
              <ShieldCheck className="h-3.5 w-3.5" />
              <div>
                <strong>{device.safeZone ? "Within Safe Zone" : "Outside Safe Zone"}</strong>
                <span>{device.location.split("·")[0]?.trim() || "Monitored area"}</span>
              </div>
            </div>
          </div>

          <div className="f2s-cc-card">
            <div className="f2s-cc-card-head">
              <h3>Recent Activity</h3>
              <Link to="/alerts/risk-detected">View All ›</Link>
            </div>
            <ul className="f2s-cc-activity">
              {[
                ["Location updated", `${user.label}’s location refreshed`, "Just now"],
                ["Vitals synced", "Device data updated", device.lastSync],
                [theme.label, statusCopy, "Recent"],
                ["Device connected", "Wearable connection restored", "Earlier"],
              ].map(([t, d, time]) => (
                <li key={t}>
                  <i />
                  <div>
                    <strong>{t}</strong>
                    <p>{d}</p>
                  </div>
                  <time>{time}</time>
                </li>
              ))}
            </ul>
          </div>

          <div className="f2s-cc-card">
            <h3>Quick Actions</h3>
            <div className="f2s-cc-actions">
              <a href="tel:+919876543210">
                <Phone className="h-4 w-4" /> Call User
              </a>
              <Link to="/messages">
                <MessageCircle className="h-4 w-4" /> Message
              </Link>
              <Link to="/map">
                <Route className="h-4 w-4" /> View Route
              </Link>
              <Link to="/map">
                <Share2 className="h-4 w-4" /> Share Location
              </Link>
            </div>
            <Link
              to="/alerts/manual-sos"
              className="f2s-cc-escalate"
              onClick={(e) => {
                if (!window.confirm("Open alert escalation flow? This does not send a new SOS.")) {
                  e.preventDefault()
                }
              }}
            >
              <TriangleAlert className="h-4 w-4" />
              Escalate Alert
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
