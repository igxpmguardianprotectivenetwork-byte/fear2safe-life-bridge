import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  BatteryMedium,
  Bell,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Signal,
  Siren,
  Smartphone,
  TriangleAlert,
  UsersRound,
  Wifi,
} from "lucide-react"
import {
  emergencyContacts,
  getActiveIncidents,
  getAlert,
  guardians,
  type AlertItem,
  type AlertWorkflowState,
} from "../data/mock"
import { GoogleLiveMap } from "../components/GoogleLiveMap"
import { deviceForUser } from "../components/liveVitals/LiveVitalsGrid"

const tabs = [
  "Overview",
  "Location",
  "Vitals & Sensors",
  "Timeline",
  "Media",
  "Guardian Response",
  "Device Info",
  "Analysis",
  "Reports",
] as const

type Tab = (typeof tabs)[number]

const workflowSteps: { id: AlertWorkflowState; label: string }[] = [
  { id: "DETECTED", label: "Detection" },
  { id: "VERIFYING", label: "Verification" },
  { id: "GUARDIAN_RESPONSE", label: "Guardian Response" },
  { id: "ESCALATED", label: "Escalation" },
  { id: "RESOLVED", label: "Resolution" },
]

function workflowIndex(state: AlertWorkflowState) {
  return Math.max(0, workflowSteps.findIndex((s) => s.id === state))
}

function severityLabel(a: AlertItem) {
  if (a.sos || a.severity === "emergency") return "Emergency"
  if (a.severity === "high") return "High Priority"
  if (a.severity === "medium") return "Attention"
  return "Low"
}

function chipTone(a: AlertItem) {
  if (a.sos || a.severity === "emergency") return "sos"
  if (a.workflow === "VERIFYING" || a.status === "Needs Verification") return "verify"
  if (a.severity === "high") return "high"
  return "attention"
}

function statusBadge(a: AlertItem, resolved: boolean) {
  if (resolved || a.workflow === "RESOLVED") return "RESOLVED"
  if (a.workflow === "ESCALATED") return "ESCALATED"
  if (a.workflow === "VERIFYING" || a.status === "Needs Verification") return "UNDER VERIFICATION"
  if (a.workflow === "GUARDIAN_RESPONSE") return "GUARDIAN RESPONSE"
  return "ACTIVE"
}

function IncidentQueue({
  currentId,
  incidents,
  onSelect,
}: {
  currentId: string
  incidents: AlertItem[]
  onSelect: (id: string) => void
}) {
  const emergency = incidents.filter((i) => i.sos || i.severity === "emergency").length
  const verify = incidents.filter((i) => i.workflow === "VERIFYING").length
  const attention = incidents.filter(
    (i) => !i.sos && i.severity !== "emergency" && i.workflow !== "VERIFYING",
  ).length

  return (
    <section className="f2s-ad-queue" aria-label="Active incidents">
      <div className="f2s-ad-queue-head">
        <p>
          Active Incidents · <strong>{incidents.length}</strong>
        </p>
        <div className="f2s-ad-queue-counts">
          <span className="sos">Emergency {emergency}</span>
          <span className="verify">Verification {verify}</span>
          <span className="attn">Attention {attention}</span>
        </div>
      </div>
      <div className="f2s-ad-queue-scroll">
        {incidents.map((inc) => (
          <button
            key={inc.id}
            type="button"
            className={`f2s-ad-chip tone-${chipTone(inc)} ${inc.id === currentId ? "is-active" : ""}`}
            onClick={() => onSelect(inc.id)}
          >
            <span className="f2s-ad-chip-av">{inc.person.slice(0, 1)}</span>
            <span className="min-w-0 text-left">
              <strong>{inc.person}</strong>
              <em>
                {inc.sos ? "SOS" : severityLabel(inc)} · {inc.activeMinutes ?? 0} min
              </em>
            </span>
            {inc.sos ? <Siren className="h-3.5 w-3.5" /> : <TriangleAlert className="h-3.5 w-3.5" />}
          </button>
        ))}
      </div>
    </section>
  )
}

export function AlertDetail() {
  const { id = "risk-detected" } = useParams()
  const navigate = useNavigate()
  const alert = getAlert(id)
  const [tab, setTab] = useState<Tab>("Overview")
  const [notes, setNotes] = useState("")
  const [resolved, setResolved] = useState(alert.workflow === "RESOLVED")
  const [toast, setToast] = useState<AlertItem | null>(null)
  const [now, setNow] = useState(() => new Date())

  const activeIncidents = useMemo(() => getActiveIncidents(), [])

  useEffect(() => {
    setResolved(alert.workflow === "RESOLVED")
    setTab("Overview")
    setNotes("")
  }, [alert.id, alert.workflow])

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(t)
  }, [])

  // Surface higher-priority SOS while viewing another incident (demo realtime awareness)
  useEffect(() => {
    const higher = activeIncidents.find(
      (a) => a.id !== alert.id && (a.sos || a.severity === "emergency"),
    )
    if (!higher) {
      setToast(null)
      return
    }
    if (alert.sos || alert.severity === "emergency") {
      setToast(null)
      return
    }
    setToast(higher)
  }, [alert.id, alert.sos, alert.severity, activeIncidents])

  const device = alert.userId ? deviceForUser(alert.userId) : null
  const activeMinutes = alert.activeMinutes ?? 0
  const markerColor =
    alert.sos || alert.severity === "emergency"
      ? "#F2385A"
      : alert.workflow === "VERIFYING"
        ? "#3478F6"
        : alert.severity === "high"
          ? "#F2385A"
          : "#F5A214"

  const wfIdx = workflowIndex(resolved ? "RESOLVED" : alert.workflow)

  const activity = [
    {
      t: "04:31 AM",
      title: alert.alertType,
      detail: alert.reason,
      tone: "red",
    },
    {
      t: "04:31 AM",
      title: "No response from user",
      detail: "No device interaction detected after trigger",
      tone: "orange",
    },
    {
      t: "04:30 AM",
      title: "Unusual motion pattern",
      detail: "Irregular movement detected on wearable",
      tone: "orange",
    },
    {
      t: "04:28 AM",
      title: "Vitals anomaly",
      detail: device ? `Heart rate ${device.heartRate} bpm` : "Physiological deviation noted",
      tone: "blue",
    },
  ]

  const guardianRows = [
    ...guardians.map((g, i) => ({
      name: g.name,
      role: g.relation,
      time: i === 0 ? "04:31 AM" : "04:32 AM",
      state: i === 0 ? "Delivered" : g.role === "Secondary" ? "Pending" : "Delivered",
    })),
    ...emergencyContacts.slice(0, 1).map((c) => ({
      name: c.name,
      role: c.relation,
      time: "04:32 AM",
      state: "Delivered",
    })),
  ]

  const onResolve = () => {
    if (!window.confirm("Mark this incident as resolved? This does not notify external services.")) return
    setResolved(true)
  }

  const onEscalate = () => {
    window.confirm("Open escalation workflow? This does not contact police automatically.")
  }

  return (
    <div className="f2s-ad-page">
      {toast ? (
        <div className="f2s-ad-toast" role="status">
          <div>
            <p className="f2s-ad-toast-title">New Emergency</p>
            <p>
              {toast.person} · {toast.title}
            </p>
          </div>
          <button type="button" onClick={() => navigate(`/alerts/${toast.id}`)}>
            Open Incident
          </button>
        </div>
      ) : null}

      <div className="f2s-ad-topnav">
        <Link to="/alerts/risk-detected" className="f2s-ad-back">
          <ArrowLeft className="h-4 w-4" /> Back to Alerts
        </Link>
        <div className="f2s-ad-topnav-right">
          <span className="f2s-ad-inc-id">INC-2026-{alert.id.slice(0, 8).toUpperCase()}</span>
          <button type="button" className="f2s-ad-resolve" onClick={onResolve}>
            <CheckCircle2 className="h-4 w-4" />
            {resolved ? "Resolved" : "Mark as Resolved"}
          </button>
        </div>
      </div>

      <div
        className={`f2s-ad-banner ${alert.sos || alert.severity === "emergency" ? "is-sos" : alert.workflow === "VERIFYING" ? "is-verify" : "is-high"}`}
      >
        <div className="f2s-ad-banner-icon">
          {alert.sos ? <Siren className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="f2s-ad-banner-title-row">
            <h1>
              {alert.title} — {severityLabel(alert)}
            </h1>
            {alert.sos ? <span className="f2s-ad-sos-pill">SOS</span> : null}
          </div>
          <p>{alert.reason}</p>
        </div>
        <div className="f2s-ad-banner-meta">
          <span className="f2s-ad-state">
            {statusBadge(alert, resolved)}
          </span>
          <span className="f2s-ad-live">
            <i /> LIVE · Active for {activeMinutes} min
          </span>
        </div>
      </div>

      <IncidentQueue
        currentId={alert.id}
        incidents={activeIncidents}
        onSelect={(nid) => navigate(`/alerts/${nid}`)}
      />

      <div className="f2s-ad-tabs" role="tablist">
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

      {(tab === "Overview" || tab === "Location") && (
        <div className={`f2s-ad-main ${tab === "Location" ? "is-map-focus" : ""}`}>
          {tab === "Overview" && (
            <section className="f2s-ad-card">
              <div className="f2s-ad-card-head">
                <h2>Alert Information</h2>
                <span className={`f2s-ad-sev tone-${chipTone(alert)}`}>{severityLabel(alert)}</span>
              </div>
              <dl className="f2s-ad-info">
                <div>
                  <dt>Person</dt>
                  <dd>
                    <Link
                      to={alert.userId ? `/dashboard?tab=vitals&user=${alert.userId}` : "/dashboard?tab=vitals"}
                      className="f2s-ad-person"
                    >
                      <span className="av">{alert.person.slice(0, 1)}</span>
                      {alert.person}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt>User ID</dt>
                  <dd>{alert.nodeId ?? "—"}</dd>
                </div>
                <div>
                  <dt>Device</dt>
                  <dd>
                    {alert.deviceName ?? "Fear2Safe Health Band"}
                    {alert.firmware ? ` (${alert.firmware})` : ""}
                    {(alert.battery ?? device?.battery) != null ? (
                      <span className="f2s-ad-bat">
                        <BatteryMedium className="h-3.5 w-3.5" />
                        {alert.battery ?? device?.battery}%
                      </span>
                    ) : null}
                  </dd>
                </div>
                <div>
                  <dt>Alert Type</dt>
                  <dd>{alert.alertType}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <span className={`f2s-ad-status-pill ${resolved ? "ok" : "hot"}`}>
                      {resolved ? "Resolved" : "Active"}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Detected At</dt>
                  <dd>
                    {alert.detectedAtLabel ?? alert.time}
                    <em>{alert.time}</em>
                  </dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>
                    <MapPin className="inline h-3.5 w-3.5 text-[#F2385A]" /> {alert.location}
                  </dd>
                </div>
                <div>
                  <dt>Safe Zone</dt>
                  <dd>
                    <span className={`f2s-ad-zone ${alert.outsideSafeZone ? "out" : "in"}`}>
                      {alert.outsideSafeZone ? "Outside Safe Zone" : "Within Safe Zone"}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Detection Source</dt>
                  <dd>{alert.source}</dd>
                </div>
                <div>
                  <dt>Possible Trigger</dt>
                  <dd>{alert.reason}</dd>
                </div>
              </dl>
            </section>
          )}

          <section className="f2s-ad-card f2s-ad-map-card">
            <div className="f2s-ad-card-head">
              <h2>Live Location</h2>
              <Link to="/map" className="f2s-ad-link">
                Open in Full Map
              </Link>
            </div>
            <div className="f2s-ad-map-wrap">
              <GoogleLiveMap
                className="f2s-ad-map"
                fallbackCenter={{ lat: alert.lat, lng: alert.lng }}
                zoom={15}
                showLiveUser={false}
                hideFloatingStats
                followLive={false}
                focusTarget={{ lat: alert.lat, lng: alert.lng }}
                selectedId={alert.id}
                markers={[
                  {
                    id: alert.id,
                    lat: alert.lat,
                    lng: alert.lng,
                    label: alert.person,
                    color: markerColor,
                    detail:
                      alert.sos || alert.severity === "emergency"
                        ? "alert"
                        : alert.workflow === "VERIFYING"
                          ? "verify"
                          : alert.severity === "medium"
                            ? "attention"
                            : "alert",
                  },
                ]}
              />
              <div className="f2s-ad-map-callout">
                <p>Current Location</p>
                <strong>
                  {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </strong>
                <span>
                  {alert.lat.toFixed(5)}, {alert.lng.toFixed(5)}
                </span>
                <em>
                  <i /> LIVE GPS
                </em>
              </div>
              <div className="f2s-ad-map-foot">
                <span className={alert.outsideSafeZone ? "warn" : "ok"}>
                  <TriangleAlert className="h-3.5 w-3.5" />
                  {alert.outsideSafeZone
                    ? "User is outside defined safe zone"
                    : "User is within safe zone"}
                </span>
                <span>
                  Accuracy: {device?.gpsAccuracy === "High" ? "8 m" : "25 m"} · Updated 10 seconds ago
                </span>
              </div>
            </div>
          </section>
        </div>
      )}

      {tab === "Overview" && (
        <>
          <div className="f2s-ad-workflow">
            {workflowSteps.map((step, i) => {
              const done = i < wfIdx || (resolved && step.id === "RESOLVED")
              const active = i === wfIdx && !resolved
              return (
                <div key={step.id} className={`f2s-ad-wf-step ${done ? "done" : ""} ${active ? "active" : ""}`}>
                  {i > 0 ? <span className="line" /> : null}
                  <span className="circle">{done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}</span>
                  <p>{step.label}</p>
                  <em>
                    {done ? "Complete" : active ? "Active" : step.id === "ESCALATED" ? "Not initiated" : "Pending"}
                  </em>
                </div>
              )
            })}
          </div>

          <div className="f2s-ad-actions">
            <a className="ghost" href={`tel:${guardians[0]?.phone?.replace(/\s/g, "") ?? ""}`}>
              <Phone className="h-4 w-4" /> Call User
            </a>
            <Link className="ghost" to="/messages">
              <MessageCircle className="h-4 w-4" /> Message
            </Link>
            <Link className="blue" to="/map">
              <Navigation className="h-4 w-4" /> View on Live Map
            </Link>
            <Link className="teal" to="/guardians">
              <UsersRound className="h-4 w-4" /> Notify Guardians
            </Link>
            {alert.workflow === "VERIFYING" ? (
              <button type="button" className="ghost" onClick={() => window.alert("Verification marked in progress (demo).")}>
                <ShieldCheck className="h-4 w-4" /> Verify
              </button>
            ) : null}
            <button type="button" className="danger" onClick={onEscalate}>
              <Siren className="h-4 w-4" /> Escalate
            </button>
          </div>

          <div className="f2s-ad-bottom">
            <section className="f2s-ad-card">
              <div className="f2s-ad-card-head">
                <h2>Recent Activity</h2>
                <button type="button" className="f2s-ad-link" onClick={() => setTab("Timeline")}>
                  View All
                </button>
              </div>
              <ul className="f2s-ad-timeline">
                {activity.map((e) => (
                  <li key={e.title} className={`tone-${e.tone}`}>
                    <i />
                    <div>
                      <strong>{e.title}</strong>
                      <p>{e.detail}</p>
                    </div>
                    <time>{e.t}</time>
                  </li>
                ))}
              </ul>
            </section>

            <section className="f2s-ad-card">
              <div className="f2s-ad-card-head">
                <h2>Guardian Response</h2>
              </div>
              <ul className="f2s-ad-guardians">
                {guardianRows.map((g) => (
                  <li key={g.name}>
                    <span className="av">{g.name.slice(0, 1)}</span>
                    <div className="min-w-0 flex-1">
                      <strong>{g.name}</strong>
                      <p>
                        {g.role} · Notified · {g.time}
                      </p>
                    </div>
                    <span className={`pill ${g.state === "Delivered" ? "ok" : "wait"}`}>{g.state}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="f2s-ad-card">
              <div className="f2s-ad-card-head">
                <h2>Latest Media</h2>
              </div>
              <div className="f2s-ad-media-empty">
                <ImageIcon className="h-5 w-5" />
                <p>No verification media available yet.</p>
                <span>Location / vitals snapshots appear here when captured.</span>
              </div>
            </section>

            <section className="f2s-ad-card">
              <div className="f2s-ad-card-head">
                <h2>Notes</h2>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, 500))}
                rows={5}
                placeholder="Add notes about this incident..."
                className="f2s-ad-notes"
              />
              <div className="f2s-ad-notes-foot">
                <span>{notes.length} / 500</span>
                <button type="button" onClick={() => window.alert("Note saved locally for this session.")}>
                  Save Note
                </button>
              </div>
              <p className="f2s-ad-notes-hint">Visible to authorized response operators.</p>
            </section>
          </div>
        </>
      )}

      {tab === "Vitals & Sensors" && (
        <section className="f2s-ad-card">
          <h2>Wearable sensors</h2>
          <div className="f2s-ad-vitals">
            {[
              ["Heart Rate", device ? `${device.heartRate} bpm` : "—"],
              ["SpO₂", device ? `${device.spo2}%` : "—"],
              ["Skin Temp", device ? `${device.skinTemperature}°C` : "—"],
              ["HRV", device ? `${device.hrv} ms` : "—"],
              ["Activity", device?.activity ?? "—"],
              ["Accelerometer", device ? `${device.accelerometerG} g` : "—"],
            ].map(([k, v]) => (
              <div key={k}>
                <Activity className="h-4 w-4" />
                <span>{k}</span>
                <strong>{v}</strong>
              </div>
            ))}
          </div>
          <p className="f2s-ad-notes-hint">Blood pressure, glucose, and ECG are not shown — not measured by this band.</p>
        </section>
      )}

      {tab === "Timeline" && (
        <section className="f2s-ad-card">
          <h2>Incident timeline</h2>
          <ul className="f2s-ad-timeline tall">
            {activity.map((e) => (
              <li key={e.title} className={`tone-${e.tone}`}>
                <i />
                <div>
                  <strong>{e.title}</strong>
                  <p>{e.detail}</p>
                </div>
                <time>{e.t}</time>
              </li>
            ))}
            <li className="tone-blue">
              <i />
              <div>
                <strong>Verification state initiated</strong>
                <p>Operator review required</p>
              </div>
              <time>04:32 AM</time>
            </li>
            <li className="tone-green">
              <i />
              <div>
                <strong>Guardian notification sent</strong>
                <p>Primary guardian notified</p>
              </div>
              <time>04:32 AM</time>
            </li>
          </ul>
        </section>
      )}

      {tab === "Media" && (
        <section className="f2s-ad-card">
          <h2>Media</h2>
          <div className="f2s-ad-media-empty">
            <ImageIcon className="h-5 w-5" />
            <p>No verification media available yet.</p>
          </div>
        </section>
      )}

      {tab === "Guardian Response" && (
        <section className="f2s-ad-card">
          <h2>Guardian response</h2>
          <ul className="f2s-ad-guardians">
            {guardianRows.map((g) => (
              <li key={g.name}>
                <span className="av">{g.name.slice(0, 1)}</span>
                <div className="min-w-0 flex-1">
                  <strong>{g.name}</strong>
                  <p>
                    {g.role} · Notified · {g.time}
                  </p>
                </div>
                <span className={`pill ${g.state === "Delivered" ? "ok" : "wait"}`}>{g.state}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "Device Info" && (
        <section className="f2s-ad-card">
          <h2>Device info</h2>
          <dl className="f2s-ad-info">
            {[
              ["Device Name", alert.deviceName ?? device?.name ?? "Fear2Safe Health Band"],
              ["Device ID", device?.serial ?? alert.nodeId ?? "—"],
              ["Firmware", alert.firmware ?? "FW-1.2.0"],
              ["Battery", `${alert.battery ?? device?.battery ?? "—"}%`],
              ["Connectivity", device?.connectionType ?? "Bluetooth + LTE"],
              ["Signal", device?.signalStrength ?? "—"],
              ["GPS", device?.gpsAccuracy ? `${device.gpsAccuracy} accuracy` : "Live GPS"],
              ["Last Sync", device?.lastSync ?? "Just now"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="f2s-ad-device-icons">
            <Smartphone className="h-4 w-4" />
            <Wifi className="h-4 w-4" />
            <Signal className="h-4 w-4" />
            <BatteryMedium className="h-4 w-4" />
          </div>
        </section>
      )}

      {tab === "Analysis" && (
        <section className="f2s-ad-card">
          <div className="f2s-ad-card-head">
            <h2>Risk Analysis</h2>
            <BrainCircuit className="h-4 w-4 text-[#149FE8]" />
          </div>
          <p className="f2s-ad-analysis-lead">Signals contributing to this event (deterministic rules):</p>
          <ul className="f2s-ad-analysis">
            <li>
              <AlertCircle className="h-4 w-4" /> {alert.alertType}
            </li>
            <li>
              <AlertCircle className="h-4 w-4" /> {alert.reason}
            </li>
            <li>
              <AlertCircle className="h-4 w-4" /> Detection source: {alert.source}
            </li>
            <li>
              <AlertCircle className="h-4 w-4" />{" "}
              {alert.outsideSafeZone ? "User currently outside configured safe zone" : "User inside safe zone"}
            </li>
          </ul>
          <p className="f2s-ad-notes-hint">
            This is rule-based signal evidence — not a medical diagnosis or crime prediction.
          </p>
        </section>
      )}

      {tab === "Reports" && (
        <section className="f2s-ad-card">
          <div className="f2s-ad-card-head">
            <h2>Incident report</h2>
            <FileText className="h-4 w-4 text-[#6A8099]" />
          </div>
          <ul className="f2s-ad-report-list">
            <li>Incident Summary · {alert.title}</li>
            <li>Person · {alert.person}</li>
            <li>Location · {alert.location}</li>
            <li>Workflow · {resolved ? "RESOLVED" : alert.workflow}</li>
            <li>Guardian notifications · {guardianRows.length} contacts</li>
          </ul>
          <button type="button" className="f2s-ad-export" disabled title="Export available when report API is connected">
            Export PDF
          </button>
        </section>
      )}
    </div>
  )
}
