import { Link } from "react-router-dom"
import {
  Activity,
  BatteryMedium,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Droplets,
  Grid2X2,
  Heart,
  HeartPulse,
  Leaf,
  Lightbulb,
  MapPin,
  Settings2,
  Share2,
  ShieldCheck,
  Signal,
  Siren,
  Thermometer,
  Users,
  Watch,
  Wifi,
  Zap,
} from "lucide-react"
import type { ProtectionDevice } from "../../data/devices"
import { igxpmLogoUrl } from "../../lib/brand"
import type { WatchLiveCoords } from "../../lib/useWatchLive"
import { wristStatusLabel } from "../../lib/useWatchLive"
import { HealthBand3D } from "../HealthBand3D"
import { WatchScreenMirror } from "../WatchScreenMirror"
import type { WatchLiveSnapshot } from "../../lib/supabase"
import { GoogleLiveMap } from "../GoogleLiveMap"

function SignalBars({ strong }: { strong: boolean }) {
  return (
    <div className="f2s-signal-bars" aria-hidden>
      {[5, 8, 11, 14, 17].map((h, i) => (
        <span key={h} className={strong || i < 3 ? "on" : "dim"} style={{ height: h }} />
      ))}
    </div>
  )
}

export function DevicePageHeader({
  device,
  selectedId,
  onSelect,
  devices,
}: {
  device: ProtectionDevice
  selectedId: number
  onSelect: (id: number) => void
  devices: ProtectionDevice[]
}) {
  const wristClass =
    device.onWrist === true ? "is-on" : device.onWrist === false ? "is-off" : "is-unknown"
  const wristText = wristStatusLabel(device.onWrist)
  return (
    <header className="f2s-device-header">
      <div className="f2s-device-title-block">
        <div className="f2s-device-title-row">
          <span className="f2s-device-title-icon">
            <ShieldCheck />
          </span>
          <h1>My Protection Device</h1>
        </div>
        <p className="f2s-device-subtitle">Fear 2 Safe Health Band · {device.serial}</p>
      </div>

      <nav className="f2s-device-tabs" aria-label="Device selection">
        <span className="f2s-tab f2s-tab-status">
          <ShieldCheck />
          Device Status
        </span>
        {devices.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => onSelect(d.id)}
            className={`f2s-tab ${selectedId === d.id ? "f2s-tab-active" : ""}`}
          >
            {selectedId === d.id && <Watch />}
            {d.label}
          </button>
        ))}
      </nav>

      <div className="f2s-device-connected">
        {device.isOwnDevice || device.onWrist != null ? (
          <span className={`f2s-wrist-pill ${wristClass}`}>
            <Watch />
            {wristText}
          </span>
        ) : null}
        <span className="f2s-connected-pill">
          <span className="f2s-dot-live" />
          Connected
        </span>
        <span className="f2s-signal-chip">
          <Signal />
          <SignalBars strong={device.signalStrength === "Strong"} />
        </span>
      </div>
    </header>
  )
}

export function DeviceHero({
  device,
  snapshot = null,
  realtime = false,
}: {
  device: ProtectionDevice
  snapshot?: WatchLiveSnapshot | null
  realtime?: boolean
}) {
  return (
    <section className="f2s-hero-card">
      <div className="f2s-hero-stage">
        <div className="f2s-hero-brand">
          <img
            src={igxpmLogoUrl}
            alt="IGXPM"
            className="f2s-hero-logo"
          />
          <div>
            <p className="f2s-hero-brand-name">Fear2Safe</p>
            <p className="f2s-hero-tagline">Safer People</p>
            <p className="f2s-hero-tagline">Brighter Tomorrows</p>
          </div>
        </div>

        <ul className="f2s-hero-points">
          <li>
            <span>
              <ShieldCheck />
            </span>
            Always With You
          </li>
          <li>
            <span>
              <Leaf />
            </span>
            Smarter Safety
          </li>
          <li>
            <span>
              <Users />
            </span>
            For a Safer Tomorrow
          </li>
        </ul>

        <p className="f2s-hero-script">
          Health
          <br />
          Safety
          <br />
          Peace of Mind
        </p>

        <svg className="f2s-hero-wave" viewBox="0 0 720 64" preserveAspectRatio="none" aria-hidden>
          <path d="M0 32 H90 L110 32 L130 10 L150 54 L170 18 L190 46 L210 32 H360 L380 32 L400 8 L420 56 L440 16 L460 48 L480 32 H720" />
        </svg>

        <div className="f2s-hero-band">
          {device.isOwnDevice ? (
            <WatchScreenMirror
              device={device}
              hr={snapshot?.health?.heart_rate}
              spo2={snapshot?.health?.spo2}
              temp={snapshot?.health?.temperature_c}
              sbp={snapshot?.health?.bp_systolic}
              dbp={snapshot?.health?.bp_diastolic}
              realtime={realtime}
              clock={snapshot?.clock}
              size="md"
            />
          ) : (
            <HealthBand3D variant="pedestal" />
          )}
        </div>

        <div className="f2s-hero-caption">
          <h2>Fear2Safe Health Band</h2>
          <p>
            {device.label} · {device.wearer} · {device.serial}
          </p>
        </div>
      </div>
    </section>
  )
}

function CardHead({
  icon: Icon,
  title,
  action,
  to,
}: {
  icon: typeof Wifi
  title: string
  action: string
  to?: string
}) {
  return (
    <div className="f2s-card-head">
      <div className="f2s-card-head-left">
        <Icon />
        <h3>{title}</h3>
      </div>
      {to ? (
        <Link to={to} className="f2s-card-link">
          {action} <ChevronRight />
        </Link>
      ) : (
        <button type="button" className="f2s-card-link">
          {action} <ChevronRight />
        </button>
      )}
    </div>
  )
}

export function ConnectionStatusCard({ device }: { device: ProtectionDevice }) {
  return (
    <article className="f2s-status-card">
      <CardHead icon={Wifi} title="Connection Status" action="View Details" />
      <div className="f2s-conn-panel">
        <div className="f2s-conn-main">
          <span className="f2s-conn-badge">
            <span className="f2s-dot-live" />
            Connected
          </span>
          <p>
            Last sync {device.lastSync} · {device.connectionType}
            {device.onWrist === true
              ? " · On wrist"
              : device.onWrist === false
                ? " · Off wrist"
                : ""}
          </p>
        </div>
        <div className="f2s-conn-signal">
          <span>Signal Strength</span>
          <div className="f2s-conn-signal-row">
            <SignalBars strong={device.signalStrength === "Strong"} />
            <strong>{device.signalStrength}</strong>
          </div>
        </div>
      </div>
    </article>
  )
}

export function BatteryStatusCard({ device }: { device: ProtectionDevice }) {
  return (
    <article className="f2s-status-card">
      <CardHead
        icon={BatteryMedium}
        title={`Battery Level · ${device.label}`}
        action="View Details"
      />
      <div className="f2s-batt-row">
        <div className="f2s-batt-main">
          <p className="f2s-batt-pct">{device.battery}%</p>
          <div className="f2s-batt-bar-wrap">
            <div className="f2s-batt-bar" style={{ width: `${device.battery}%` }} />
          </div>
          <p className="f2s-batt-eta">~{device.estimatedBatteryHours} hrs remaining</p>
        </div>
        <div className="f2s-batt-alert">
          <Bell />
          <div>
            <span>Low Power Alert</span>
            <strong>Off</strong>
          </div>
        </div>
      </div>
    </article>
  )
}

export function LocationCard({
  device,
  coords = null,
}: {
  device: ProtectionDevice
  coords?: WatchLiveCoords
}) {
  const center = coords ?? { lat: 6.8544, lng: 79.8635 }
  return (
    <article className="f2s-status-card">
      <CardHead icon={MapPin} title="Location" action="View on Map" to="/map" />
      <div className="f2s-loc-row">
        <div>
          <p className="f2s-loc-name">{device.location}</p>
          <p className="f2s-loc-meta">
            {coords
              ? `Live GPS · ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
              : device.isOwnDevice
                ? "Google Map · waiting for a GPS fix"
                : `Precision: street-level · Linked to ${device.wearer}`}
          </p>
          <p className="f2s-loc-gps">
            GPS Accuracy <strong>{device.gpsAccuracy}</strong>
          </p>
        </div>
        <div className="f2s-loc-map">
          <GoogleLiveMap
            className="f2s-loc-map-canvas"
            fallbackCenter={center}
            zoom={15}
            showLiveUser={Boolean(coords)}
            externalLive={coords}
            hideFloatingStats
            followLive={Boolean(coords)}
          />
        </div>
      </div>
    </article>
  )
}

export function ProtectionStateCard({ device }: { device: ProtectionDevice }) {
  return (
    <article className="f2s-status-card">
      <CardHead icon={ShieldCheck} title="Protection State" action="View Details" />
      <div className="f2s-prot-panel">
        <div className="f2s-prot-main">
          <ShieldCheck />
          <div>
            <p>Protected</p>
            <span>Monitoring Active</span>
          </div>
        </div>
        <div className="f2s-prot-meta">
          <div>
            <span className="f2s-dot-live" />
            Real-time Monitoring
            <strong>Active</strong>
          </div>
          <div>
            <Users />
            Guardians Connected
            <strong>{device.guardiansConnected} Guardians</strong>
          </div>
        </div>
      </div>
    </article>
  )
}

const actions = [
  {
    key: "sos",
    title: "Test SOS",
    desc: "Trigger a test alert to check your device is working properly.",
    icon: Siren,
    tone: "sos",
    to: undefined as string | undefined,
  },
  {
    key: "find",
    title: "Find My Device",
    desc: "Locate your device on the map.",
    icon: MapPin,
    tone: "blue",
    to: "/map",
  },
  {
    key: "settings",
    title: "Device Settings",
    desc: "Manage preferences and configuration.",
    icon: Settings2,
    tone: "navy",
    to: "/settings",
  },
  {
    key: "checkin",
    title: "Start Safety Check-in",
    desc: "Start a quick check-in with your guardians.",
    icon: ShieldCheck,
    tone: "green",
    to: undefined,
  },
  {
    key: "share",
    title: "Share Live Location",
    desc: "Share your real-time location with trusted contacts.",
    icon: Share2,
    tone: "purple",
    to: "/map",
  },
  {
    key: "guardians",
    title: "Family Guardians",
    desc: "Manage your guardians and permissions.",
    icon: Users,
    tone: "orange",
    to: "/guardians",
  },
]

export function QuickActions({ onTestSos }: { onTestSos: () => void }) {
  return (
    <section className="f2s-quick-card">
      <div className="f2s-card-head">
        <div className="f2s-card-head-left">
          <Zap />
          <h3>Quick Actions</h3>
        </div>
        <button type="button" className="f2s-card-link">
          <Grid2X2 /> More Actions
        </button>
      </div>
      <div className="f2s-quick-grid">
        {actions.map((a) => {
          const Icon = a.icon
          const inner = (
            <>
              <span className={`f2s-quick-icon f2s-tone-${a.tone}`}>
                <Icon />
              </span>
              <span className="f2s-quick-copy">
                <strong>{a.title}</strong>
                <em>{a.desc}</em>
              </span>
              <ChevronRight className="f2s-quick-chevron" />
            </>
          )
          if (a.key === "sos") {
            return (
              <button key={a.key} type="button" className="f2s-quick-tile" onClick={onTestSos}>
                {inner}
              </button>
            )
          }
          if (a.to) {
            return (
              <Link key={a.key} to={a.to} className="f2s-quick-tile">
                {inner}
              </Link>
            )
          }
          return (
            <button key={a.key} type="button" className="f2s-quick-tile">
              {inner}
            </button>
          )
        })}
      </div>
    </section>
  )
}

function PulseWaveform() {
  return (
    <div className="f2s-pulse-wrap">
      <div className="f2s-pulse-top">
        <span>Pulse / PPG waveform · live pulse signal</span>
        <button type="button" className="f2s-live-select">
          Live ▾
        </button>
      </div>
      <svg className="f2s-pulse-svg" viewBox="0 0 360 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id="f2sPulseFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#12CBEA" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#12CBEA" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[20, 40, 60, 80, 100].map((y) => (
          <line key={y} x1="0" y1={y} x2="360" y2={y} className="f2s-pulse-grid" />
        ))}
        <path
          className="f2s-pulse-area"
          d="M0 70 L30 70 L45 70 L60 28 L75 98 L90 48 L105 78 L120 70 L160 70 L175 70 L190 22 L205 102 L220 42 L235 82 L250 70 L300 70 L315 70 L330 30 L345 95 L360 70 L360 120 L0 120 Z"
        />
        <path
          className="f2s-pulse-line"
          d="M0 70 L30 70 L45 70 L60 28 L75 98 L90 48 L105 78 L120 70 L160 70 L175 70 L190 22 L205 102 L220 42 L235 82 L250 70 L300 70 L315 70 L330 30 L345 95 L360 70"
        />
      </svg>
    </div>
  )
}

export function HealthActivityPanel({ device }: { device: ProtectionDevice }) {
  const core = [
    {
      label: "Heart Rate (HR)",
      value: `${device.heartRate}`,
      unit: "bpm",
      note: "Live PPG",
      icon: Heart,
      tone: "pink",
    },
    {
      label: "Blood Oxygen (SpO₂)",
      value: `${device.spo2}`,
      unit: "%",
      note: device.spo2 >= 95 ? "Normal range" : "Check reading",
      icon: Droplets,
      tone: "blue",
    },
    {
      label: "Skin Temperature",
      value: `${device.skinTemperature}`,
      unit: "°C",
      note: "Wrist skin",
      icon: Thermometer,
      tone: "coral",
    },
    {
      label: "HRV",
      value: `${device.hrv}`,
      unit: "ms",
      note: "RMSSD approx.",
      icon: HeartPulse,
      tone: "purple",
    },
    {
      label: "Respiratory Rate",
      value: `${device.respiratoryRate}`,
      unit: "/min",
      note: "Derived / supported",
      icon: Activity,
      tone: "teal",
    },
    {
      label: "EDA / GSR",
      value: device.edaSupported && device.eda != null ? `${device.eda}` : "—",
      unit: device.edaSupported ? "µS" : "",
      note: device.edaSupported ? "Stress / arousal" : "Sensor not on this band",
      icon: Zap,
      tone: "navy",
      muted: !device.edaSupported,
    },
  ]

  const derived = [
    { label: "Stress / Arousal Index", value: `${device.stressIndex}`, unit: "/100", note: device.stressIndex < 35 ? "Calm" : device.stressIndex < 55 ? "Moderate" : "Elevated" },
    { label: "Resting Heart Rate", value: `${device.restingHr}`, unit: "bpm", note: "Personal baseline" },
    { label: "Heart-rate trend", value: device.hrTrend, unit: "", note: "Last 30 min" },
    { label: "HRV trend", value: device.hrvTrend, unit: "", note: "Last 30 min" },
    {
      label: "Temp vs baseline",
      value: `${device.tempDeviation > 0 ? "+" : ""}${device.tempDeviation.toFixed(2)}`,
      unit: "°C",
      note: "Personal baseline",
    },
    {
      label: "SpO₂ deviation",
      value: `${device.spo2Deviation > 0 ? "+" : ""}${device.spo2Deviation}`,
      unit: "%",
      note: `Trend · ${device.spo2Trend}`,
    },
    {
      label: "Abnormal pulse / elevated HR",
      value: device.abnormalPulse || device.elevatedHrEvent ? "Flagged" : "Clear",
      unit: "",
      note: device.elevatedHrEvent ? "Elevated HR event" : device.abnormalPulse ? "Pattern anomaly" : "No event",
      alert: device.abnormalPulse || device.elevatedHrEvent,
    },
    { label: "Physiological anomaly score", value: `${device.anomalyScore}`, unit: "/100", note: device.anomalyScore < 25 ? "Low risk" : "Review" },
    { label: "Baseline deviation score", value: `${device.baselineDeviationScore}`, unit: "/100", note: device.baselineDeviationScore < 20 ? "Near baseline" : "Drift detected" },
  ]

  return (
    <section className="f2s-health-card f2s-health-card-wide">
      <div className="f2s-card-head">
        <div className="f2s-card-head-left">
          <HeartPulse />
          <h3>Live Health & Activity</h3>
        </div>
        <div className="f2s-health-live-meta">
          <span className="f2s-live-data">
            <span className="f2s-dot-live" /> Live Data
          </span>
          <span className="f2s-sep" />
          <span>Last synced {device.lastSync}</span>
        </div>
      </div>

      <p className="f2s-bio-section-label">Core biometrics</p>
      <div className="f2s-metric-grid f2s-metric-grid-6">
        {core.map((m) => {
          const Icon = m.icon
          return (
            <div
              key={m.label}
              className={`f2s-metric f2s-metric-${m.tone}${m.muted ? " f2s-metric-muted" : ""}`}
            >
              <p>
                <Icon /> {m.label}
              </p>
              <strong>
                {m.value}
                {m.unit ? <small>{m.unit}</small> : null}
              </strong>
              <span>{m.note}</span>
            </div>
          )
        })}
      </div>

      <div className="f2s-health-mid-row">
        <div className="f2s-health-derived-col">
          <p className="f2s-bio-section-label">Derived physiological indicators</p>
          <div className="f2s-derived-grid">
            {derived.map((d) => (
              <div key={d.label} className={`f2s-derived-chip${d.alert ? " f2s-derived-alert" : ""}`}>
                <span className="f2s-derived-label">{d.label}</span>
                <strong>
                  {d.value}
                  {d.unit ? <small>{d.unit}</small> : null}
                </strong>
                <em>{d.note}</em>
              </div>
            ))}
          </div>
        </div>
        <div className="f2s-health-pulse-col">
          <p className="f2s-bio-section-label">Pulse / PPG waveform</p>
          <PulseWaveform />
        </div>
      </div>

      <p className="f2s-bio-section-label">Movement / body-state</p>
      <div className="f2s-derived-grid f2s-motion-grid">
        {[
          {
            label: "Motion / Accelerometer",
            value: `${device.accelerometerG.toFixed(2)}`,
            unit: "g",
            note: "3-axis magnitude",
            alert: false,
          },
          {
            label: "Activity level",
            value: device.activityLevel,
            unit: "",
            note: `${device.activity} · ${device.activityNote}`,
            alert: false,
          },
          {
            label: "Fall / impact detection",
            value: device.fallDetected ? "Fall" : device.impactDetected ? "Impact" : "Clear",
            unit: "",
            note: device.fallDetected || device.impactDetected ? "Review safety event" : "No fall or impact",
            alert: device.fallDetected || device.impactDetected,
          },
          {
            label: "Sudden movement",
            value: device.suddenMovement ? "Detected" : "None",
            unit: "",
            note: device.suddenMovement ? "Spike in acceleration" : "Within normal band",
            alert: device.suddenMovement,
          },
          {
            label: "Prolonged immobility",
            value: device.prolongedImmobility ? "Yes" : "No",
            unit: "",
            note:
              device.immobilityMinutes > 0
                ? `${device.immobilityMinutes} min low motion`
                : "Movement present",
            alert: device.prolongedImmobility,
          },
          {
            label: "Walking / running state",
            value: device.locomotion,
            unit: "",
            note: "Locomotion classifier",
            alert: false,
          },
          {
            label: "Orientation / posture",
            value: device.postureLabel,
            unit: "",
            note: device.postureChange ? "Posture change recently" : "Stable posture",
            alert: false,
          },
          {
            label: "Possible struggle pattern",
            value: device.strugglePattern ? "Flagged" : "Clear",
            unit: "",
            note: device.strugglePattern ? "Irregular high-energy motion" : "No struggle signature",
            alert: device.strugglePattern,
          },
        ].map((d) => (
          <div key={d.label} className={`f2s-derived-chip${d.alert ? " f2s-derived-alert" : ""}`}>
            <span className="f2s-derived-label">{d.label}</span>
            <strong>
              {d.value}
              {d.unit ? <small>{d.unit}</small> : null}
            </strong>
            <em>{d.note}</em>
          </div>
        ))}
      </div>
    </section>
  )
}

export function RecentSafetyActivity({ device }: { device: ProtectionDevice }) {
  const items = [
    {
      title: "Safe zone entered",
      detail: `You are in a safe zone (${device.location.split(" · ")[0]})`,
      time: "10:42 AM",
      tone: "green",
      icon: CheckCircle2,
    },
    {
      title: "Band synced",
      detail: `Device battery level updated (${device.battery}%)`,
      time: "10:31 AM",
      tone: "blue",
      icon: BatteryMedium,
    },
    {
      title: "Guardian check-in successful",
      detail: "Your primary guardian received your check-in",
      time: "Yesterday, 6:24 PM",
      tone: "purple",
      icon: Users,
    },
  ]

  return (
    <section className="f2s-activity-card f2s-activity-card-wide">
      <div className="f2s-card-head">
        <div className="f2s-card-head-left">
          <Clock3 />
          <h3>Recent Safety Activity</h3>
        </div>
        <button type="button" className="f2s-card-link">
          View All <ChevronRight />
        </button>
      </div>
      <ol className="f2s-timeline f2s-timeline-horizontal">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.title} className={`f2s-timeline-item f2s-tl-${item.tone}`}>
              <span className="f2s-timeline-dot">
                <Icon />
              </span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>
              <time>{item.time}</time>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export function SafetyTip() {
  return (
    <aside className="f2s-tip">
      <span className="f2s-tip-icon">
        <Lightbulb />
      </span>
      <div>
        <strong>Safety Tip</strong>
        <p>
          Keep your band charged above 20% when traveling alone. A quick double-press of the side
          button starts a silent SOS check-in with your primary guardian.
        </p>
      </div>
      <ChevronRight className="f2s-tip-chevron" />
    </aside>
  )
}
