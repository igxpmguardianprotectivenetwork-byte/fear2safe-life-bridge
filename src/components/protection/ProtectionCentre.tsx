import {
  Activity,
  BatteryCharging,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Clock3,
  Droplets,
  Footprints,
  Heart,
  HeartPulse,
  Info,
  Map as MapIcon,
  Maximize2,
  Phone,
  RadioTower,
  Share2,
  ShieldCheck,
  Thermometer,
  TriangleAlert,
  UserRound,
  UsersRound,
  Wifi,
  Zap,
} from "lucide-react"
import { Link } from "react-router-dom"
import type { ReactNode } from "react"
import type { ProtectionDashboardState } from "./dashboardState"
import { SystemStatusVisual } from "../liveVitals/LiveVitalsGrid"

export function MiniSparkline({
  values,
  color,
}: {
  values: number[]
  color: string
}) {
  const max = Math.max(...values, 0.001)
  const min = Math.min(...values)
  const range = Math.max(max - min, 0.001)
  const w = 72
  const h = 28
  const pts = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * w
      const y = h - ((v - min) / range) * (h - 4) - 2
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="f2s-pc-spark">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
        opacity={0.9}
      />
    </svg>
  )
}

export function ProtectionHeader({
  greeting,
  dateLabel,
  timeLabel,
  layer,
  onLayerChange,
}: {
  greeting: string
  dateLabel: string
  timeLabel: string
  layer: "Overview" | "Live Vitals"
  onLayerChange: (tab: "Overview" | "Live Vitals") => void
}) {
  return (
    <header className="f2s-pc-header">
      <div className="f2s-pc-header-left min-w-0">
        <p className="f2s-pc-eyebrow">Protection Centre</p>
        <h1 className="f2s-pc-title">{greeting}, Ahamed</h1>
        <p className="f2s-pc-sub">
          {layer === "Live Vitals"
            ? "Real-time health monitoring. Live device vitals and activity."
            : "Your network is protected. Real-time monitoring active across all connected users."}
        </p>
        <div className="f2s-pc-tabs" role="tablist" aria-label="Protection Centre views">
          {(["Overview", "Live Vitals"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={layer === tab}
              className={`f2s-pc-tab ${layer === tab ? "is-active" : ""}`}
              onClick={() => onLayerChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <SystemStatusVisual />

      <aside className="f2s-pc-live-status" aria-label="Live system status">
        <div className="f2s-pc-live-status-row">
          <CalendarDays className="h-4 w-4 text-[#149FE8]" aria-hidden />
          <div>
            <p className="f2s-pc-live-date">{dateLabel}</p>
            <p className="f2s-pc-live-time">
              <span className="f2s-pc-live-dot" aria-hidden />
              {timeLabel} · Live protection
            </p>
          </div>
        </div>
        <div className="f2s-pc-live-divider" />
        <div className="f2s-pc-live-status-row">
          <Wifi className="h-4 w-4 text-[#14B882]" aria-hidden />
          <div>
            <p className="f2s-pc-live-date">Real-time</p>
            <p className="f2s-pc-live-muted">network protection</p>
          </div>
        </div>
      </aside>
    </header>
  )
}

function NetworkStatusCard({
  tone,
  icon,
  title,
  value,
  sub,
  progress,
}: {
  tone: "green" | "red" | "amber"
  icon: ReactNode
  title: string
  value: string | number
  sub: string
  progress: number
}) {
  return (
    <div className={`f2s-pc-net-card f2s-pc-net-card--${tone}`}>
      <div className="f2s-pc-net-card-top">
        <span className="f2s-pc-net-icon">{icon}</span>
        <div className="min-w-0">
          <p className="f2s-pc-net-title">{title}</p>
          <p className="f2s-pc-net-value">{value}</p>
          <p className="f2s-pc-net-sub">{sub}</p>
        </div>
      </div>
      <div className="f2s-pc-net-bar" aria-hidden>
        <span style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
      </div>
    </div>
  )
}

export function LiveNetworkStatus({ state }: { state: ProtectionDashboardState }) {
  const { connectedUsers, totalUsers, needAttention, underVerification } = state
  const allOnline = connectedUsers === totalUsers

  return (
    <aside className="f2s-pc-network-panel">
      <div className="f2s-pc-network-head">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="f2s-pc-sec-icon">
            <RadioTower className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2>Live Network Status</h2>
            <p>All systems operational</p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-[#667E99]" aria-hidden />
      </div>

      <div className="f2s-pc-network-stack">
        <NetworkStatusCard
          tone="green"
          icon={<UsersRound className="h-4 w-4" />}
          title="Connected"
          value={`${connectedUsers}/${totalUsers}`}
          sub={allOnline ? "All users online" : "Some users offline"}
          progress={(connectedUsers / Math.max(totalUsers, 1)) * 100}
        />
        <NetworkStatusCard
          tone="red"
          icon={<TriangleAlert className="h-4 w-4" />}
          title="Need Attention"
          value={needAttention}
          sub="Open alerts"
          progress={needAttention > 0 ? Math.min(100, needAttention * 40) : 8}
        />
        <NetworkStatusCard
          tone="amber"
          icon={<Clock3 className="h-4 w-4" />}
          title="Under Verification"
          value={underVerification}
          sub="In review"
          progress={underVerification > 0 ? Math.min(100, underVerification * 45) : 8}
        />
      </div>
    </aside>
  )
}

export function LiveProtectionSection({
  state,
  map,
}: {
  state: ProtectionDashboardState
  map: ReactNode
}) {
  return (
    <section className="f2s-pc-map-section">
      <div className="f2s-pc-map-card">
        <div className="f2s-pc-map-card-head">
          <div className="flex min-w-0 items-start gap-2.5">
            <span className="f2s-pc-sec-icon">
              <MapIcon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h2>Live Protection Map</h2>
              <p>Real-time location tracking and safety monitoring</p>
            </div>
          </div>
          <div className="f2s-pc-map-actions">
            <span className="f2s-pc-live-pill">
              <span className="f2s-pc-live-dot" />
              LIVE GPS
            </span>
            <Link to="/map" className="f2s-pc-fullmap-btn">
              <Maximize2 className="h-3.5 w-3.5" />
              Full map
            </Link>
          </div>
        </div>
        <div className="f2s-pc-map-body">{map}</div>
      </div>
      <LiveNetworkStatus state={state} />
    </section>
  )
}

function TrendBadge({ pct, up }: { pct: number; up: boolean | null }) {
  if (up === null) {
    return <span className="f2s-pc-trend is-flat">{pct}%</span>
  }
  return (
    <span className={`f2s-pc-trend ${up ? "is-up" : "is-down"}`}>
      {up ? "↑" : "↓"} {pct}%
    </span>
  )
}

export function NetworkOverview({ state }: { state: ProtectionDashboardState }) {
  const {
    connectedUsers,
    totalUsers,
    needAttention,
    underVerification,
    activeSafeZones,
    averageResponseMinutes,
    trends,
    spark,
  } = state

  const cards = [
    {
      key: "connected",
      title: "Connected Users",
      value: `${connectedUsers}/${totalUsers}`,
      sub: connectedUsers === totalUsers ? "All users online" : "Network connectivity",
      icon: <ShieldCheck className="h-4 w-4" />,
      tone: "green" as const,
      trend: trends.connected,
      spark: spark.connected,
      color: "#14B882",
      to: undefined as string | undefined,
    },
    {
      key: "attention",
      title: "Need Attention",
      value: String(needAttention),
      sub: "Open alerts",
      icon: <TriangleAlert className="h-4 w-4" />,
      tone: "red" as const,
      trend: trends.attention,
      spark: spark.attention,
      color: "#F2385A",
      to: "/alerts/risk-detected",
    },
    {
      key: "verify",
      title: "Under Verification",
      value: String(underVerification),
      sub: "In review",
      icon: <Clock3 className="h-4 w-4" />,
      tone: "amber" as const,
      trend: trends.verification,
      spark: spark.verification,
      color: "#F5A214",
      to: "/alerts/risk-detected",
    },
    {
      key: "zones",
      title: "Active Safe Zones",
      value: String(activeSafeZones),
      sub: "Geofences monitored",
      icon: <ShieldCheck className="h-4 w-4" />,
      tone: "blue" as const,
      trend: trends.safeZones,
      spark: spark.safeZones,
      color: "#149FE8",
      to: "/map",
    },
    {
      key: "response",
      title: "Average Response Time",
      value: `${averageResponseMinutes} min`,
      sub: "From alert to first response",
      icon: <Zap className="h-4 w-4" />,
      tone: "purple" as const,
      trend: trends.response,
      spark: spark.response,
      color: "#7458E8",
      to: "/reports",
    },
  ]

  return (
    <section className="f2s-pc-overview">
      <div className="f2s-pc-overview-head">
        <div className="min-w-0">
          <h2>Network Overview</h2>
          <p>Live summary across your protection network</p>
        </div>
        <button type="button" className="f2s-pc-today-btn">
          <CalendarDays className="h-3.5 w-3.5" />
          Today
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="f2s-pc-kpi-grid">
        {cards.map((c) => {
          const inner = (
            <>
              <div className="f2s-pc-kpi-top">
                <span className={`f2s-pc-kpi-icon f2s-pc-kpi-icon--${c.tone}`}>{c.icon}</span>
                <TrendBadge pct={c.trend.pct} up={c.trend.up} />
              </div>
              <p className="f2s-pc-kpi-label">{c.title}</p>
              <p className="f2s-pc-kpi-value">{c.value}</p>
              <div className="f2s-pc-kpi-foot">
                <p className="f2s-pc-kpi-sub">{c.sub}</p>
                <MiniSparkline values={c.spark} color={c.color} />
              </div>
            </>
          )
          return c.to ? (
            <Link key={c.key} to={c.to} className={`f2s-pc-kpi f2s-pc-kpi--${c.tone}`}>
              {inner}
            </Link>
          ) : (
            <div key={c.key} className={`f2s-pc-kpi f2s-pc-kpi--${c.tone}`}>
              {inner}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function LiveVitalsSnapshot({ state }: { state: ProtectionDashboardState }) {
  const d = state.myDevice
  const metrics = [
    {
      label: "Heart Rate",
      value: `${d.heartRate} bpm`,
      status: d.abnormalPulse || d.elevatedHrEvent ? "Attention" : "Normal",
      icon: <Heart className="h-3.5 w-3.5" />,
      tone: "pink" as const,
    },
    {
      label: "SpO₂",
      value: `${d.spo2}%`,
      status: d.spo2 >= 95 ? "Normal" : "Attention",
      icon: <Droplets className="h-3.5 w-3.5" />,
      tone: "blue" as const,
    },
    {
      label: "Skin Temp",
      value: `${d.skinTemperature.toFixed(1)}°C`,
      status: Math.abs(d.tempDeviation) < 0.5 ? "Normal" : "Attention",
      icon: <Thermometer className="h-3.5 w-3.5" />,
      tone: "coral" as const,
    },
    {
      label: "HRV",
      value: `${d.hrv} ms`,
      status: d.hrv >= 40 ? "Good" : "Low",
      icon: <Activity className="h-3.5 w-3.5" />,
      tone: "cyan" as const,
    },
    {
      label: "Activity",
      value: d.locomotion === "Still" ? d.activity : d.locomotion,
      status: d.locomotion === "Still" ? "Resting" : "Active",
      icon: <Footprints className="h-3.5 w-3.5" />,
      tone: "green" as const,
    },
    {
      label: "Battery",
      value: `${d.battery}%`,
      status: d.battery > 20 ? "Charging" : "Low",
      icon: <BatteryCharging className="h-3.5 w-3.5" />,
      tone: "mint" as const,
    },
  ]

  return (
    <section className="f2s-pc-card f2s-pc-vitals">
      <div className="f2s-pc-card-head">
        <div className="flex min-w-0 items-start gap-2">
          <span className="f2s-pc-sec-icon">
            <HeartPulse className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2>Live Vitals Snapshot</h2>
            <p>Real-time health data for selected user</p>
          </div>
        </div>
        <button type="button" className="f2s-pc-user-chip">
          <span className="f2s-pc-live-dot" />
          Ahamed (You)
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="f2s-pc-vitals-grid">
        {metrics.map((m) => (
          <div key={m.label} className={`f2s-pc-vital f2s-pc-vital--${m.tone}`}>
            <span className="f2s-pc-vital-icon">{m.icon}</span>
            <p className="f2s-pc-vital-label">{m.label}</p>
            <p className="f2s-pc-vital-value">{m.value}</p>
            <p className="f2s-pc-vital-status">{m.status}</p>
          </div>
        ))}
      </div>
      <p className="f2s-pc-sync">
        Last synced {d.lastSync}
        {d.signalStrength ? ` · ${d.connectionType.split(" + ")[0]} ${d.signalStrength}` : ""}
      </p>
    </section>
  )
}

export function RecentActivity({ state }: { state: ProtectionDashboardState }) {
  const now = new Date()
  const fmt = (offsetMin: number) => {
    const t = new Date(now.getTime() - offsetMin * 60_000)
    return t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const items = [
    {
      tone: "blue" as const,
      title: "Location updated",
      detail: "My Device live GPS updated",
      time: fmt(0),
    },
    {
      tone: "red" as const,
      title: "Geofence alert",
      detail: state.alerts[0]
        ? `${state.alerts[0].title} · ${state.alerts[0].location}`
        : "User exited Safe Zone (Home)",
      time: fmt(27),
      severity: state.alerts[0]?.severity,
    },
    {
      tone: "green" as const,
      title: "Guardian notified",
      detail: "Alert sent to primary guardian",
      time: fmt(27),
    },
    {
      tone: "green" as const,
      title: "User check-in completed",
      detail: "Manual check-in successful",
      time: fmt(102),
    },
    {
      tone: "blue" as const,
      title: "Device connected",
      detail: "Wearable connection restored",
      time: fmt(107),
    },
  ]

  return (
    <section className="f2s-pc-card f2s-pc-activity">
      <div className="f2s-pc-card-head">
        <div className="flex min-w-0 items-start gap-2">
          <span className="f2s-pc-sec-icon">
            <Clock3 className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2>Recent Activity</h2>
            <p>Live incidents and system events</p>
          </div>
        </div>
        <Link to="/alerts/risk-detected" className="f2s-pc-viewall">
          View all
        </Link>
      </div>
      <ul className="f2s-pc-timeline">
        {items.map((item) => (
          <li key={item.title + item.time} className={`f2s-pc-timeline-item tone-${item.tone}`}>
            <span className="f2s-pc-timeline-dot" aria-hidden />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="f2s-pc-timeline-title">{item.title}</p>
                {"severity" in item && item.severity ? (
                  <span className={`f2s-pc-sev f2s-pc-sev--${item.severity}`}>
                    {item.severity}
                  </span>
                ) : null}
              </div>
              <p className="f2s-pc-timeline-detail">{item.detail}</p>
            </div>
            <time className="f2s-pc-timeline-time">{item.time}</time>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function GuardianResponseStatus({ state }: { state: ProtectionDashboardState }) {
  const alert = state.activeAlert
  const isGuardianNotified = alert?.status === "Guardian Notified"
  const needsVerify = alert?.status === "Needs Verification"

  const steps = [
    {
      label: "Detection",
      detail: "Alert triggered",
      time: "01:56 AM",
      state: "done" as const,
    },
    {
      label: "Verification",
      detail: needsVerify ? "In progress" : "Verified",
      time: "01:58 AM",
      state: needsVerify ? ("active" as const) : ("done" as const),
    },
    {
      label: "Guardian Response",
      detail: isGuardianNotified ? "Guardian notified" : "Awaiting guardian",
      time: isGuardianNotified ? "02:00 AM" : "--:--",
      state: isGuardianNotified ? ("active" as const) : needsVerify ? ("pending" as const) : ("active" as const),
    },
    {
      label: "Resolution",
      detail: "Pending",
      time: "--:--",
      state: "pending" as const,
    },
  ]

  return (
    <section className="f2s-pc-card f2s-pc-guardian">
      <div className="f2s-pc-card-head">
        <div className="flex min-w-0 items-start gap-2">
          <span className="f2s-pc-sec-icon">
            <UsersRound className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2>Guardian Response Status</h2>
            <p>Current alert resolution workflow</p>
          </div>
        </div>
      </div>

      <ol className="f2s-pc-steps">
        {steps.map((s, i) => (
          <li key={s.label} className={`f2s-pc-step is-${s.state}`}>
            {i > 0 ? <span className="f2s-pc-step-line" aria-hidden /> : null}
            <span className="f2s-pc-step-circle">
              {s.state === "done" ? <CircleCheck className="h-4 w-4" /> : <span>{i + 1}</span>}
            </span>
            <p className="f2s-pc-step-label">{s.label}</p>
            <p className="f2s-pc-step-detail">{s.detail}</p>
            <p className="f2s-pc-step-time">{s.time}</p>
          </li>
        ))}
      </ol>

      <div className="f2s-pc-info-strip">
        <Info className="h-4 w-4 shrink-0 text-[#149FE8]" />
        <div className="min-w-0">
          <p className="f2s-pc-info-title">
            {isGuardianNotified
              ? "Guardian response in progress"
              : needsVerify
                ? "Verification required"
                : "Monitoring active"}
          </p>
          <p className="f2s-pc-info-body">
            {isGuardianNotified
              ? "Primary guardian has been notified and is checking the situation."
              : needsVerify
                ? `${alert?.title ?? "Alert"} is awaiting verification before guardian escalation.`
                : "No active escalation. Network monitoring continues."}
          </p>
        </div>
      </div>
    </section>
  )
}

export function QuickActions() {
  return (
    <section className="f2s-pc-card f2s-pc-actions">
      <div className="f2s-pc-card-head">
        <div className="flex min-w-0 items-start gap-2">
          <span className="f2s-pc-sec-icon">
            <Zap className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2>Quick Actions</h2>
            <p>Common safety actions</p>
          </div>
        </div>
      </div>

      <div className="f2s-pc-action-grid">
        <Link to="/map" className="f2s-pc-action f2s-pc-action--blue">
          <UserRound className="h-4 w-4" />
          View Live Location
        </Link>
        <Link to="/guardians" className="f2s-pc-action f2s-pc-action--green">
          <Phone className="h-4 w-4" />
          Contact Guardian
        </Link>
        <Link to="/messages" className="f2s-pc-action f2s-pc-action--purple">
          <HeartPulse className="h-4 w-4" />
          Start Check-in
        </Link>
        <Link to="/map" className="f2s-pc-action f2s-pc-action--sky">
          <Share2 className="h-4 w-4" />
          Share Location
        </Link>
      </div>

      <Link
        to="/alerts/manual-sos"
        className="f2s-pc-escalate"
        onClick={(e) => {
          if (!window.confirm("Open alert escalation flow? This does not send a new SOS.")) {
            e.preventDefault()
          }
        }}
      >
        <TriangleAlert className="h-4 w-4" />
        Escalate Alert
      </Link>
    </section>
  )
}

export function OperationalRow({ state }: { state: ProtectionDashboardState }) {
  return (
    <div className="f2s-pc-ops">
      <LiveVitalsSnapshot state={state} />
      <RecentActivity state={state} />
      <GuardianResponseStatus state={state} />
      <QuickActions />
    </div>
  )
}
