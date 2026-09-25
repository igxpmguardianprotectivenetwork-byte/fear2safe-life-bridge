import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Phone,
  Siren,
  Users,
  Shield,
} from "lucide-react"
import { getAlert } from "../data/mock"
import { ProtectionMap } from "../components/ProtectionMap"
import { Panel } from "../components/ui"

const tabs = ["Overview", "Location", "Signals", "Actions", "Timeline"] as const

export function AlertDetail() {
  const { id = "risk-detected" } = useParams()
  const alert = getAlert(id)
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview")
  const [notes, setNotes] = useState("")
  const [resolved, setResolved] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <button
          onClick={() => setResolved(true)}
          className="rounded-full bg-pink px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink/25 hover:bg-pink-deep"
        >
          {resolved ? "Resolved" : "Mark as Resolved"}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-[16px] bg-gradient-to-r from-pink to-pink-deep px-5 py-4 text-white shadow-lg shadow-pink/30">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
          <Siren className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-lg font-extrabold">{alert.title} — High Priority</p>
          <p className="text-sm text-white/85">
            {alert.person} · {alert.location} · {alert.time}
          </p>
        </div>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold tracking-wide uppercase">
          {resolved ? "Resolved" : "Active"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-1">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t ? "bg-navy text-white" : "text-muted hover:bg-white hover:text-navy"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Key Information">
          <dl className="space-y-3.5 text-sm">
            {[
              ["Person", alert.person],
              ["Location", alert.location],
              ["Detection Source", alert.source],
              ["Reason", alert.reason],
              ["Current Status", resolved ? "Resolved" : alert.status],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-4 border-b border-border/70 pb-3 last:border-0 last:pb-0">
                <dt className="w-36 shrink-0 font-medium text-muted">{k}</dt>
                <dd className="font-semibold text-navy">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel
          title="Live Location"
          action={
            <Link to="/map" className="text-xs font-semibold text-sky-deep hover:underline">
              Open in Full Map
            </Link>
          }
        >
          <ProtectionMap
            className="h-[280px]"
            pulseId={alert.id}
            center={[alert.lat, alert.lng]}
            zoom={15}
            markers={[
              {
                id: alert.id,
                lat: alert.lat,
                lng: alert.lng,
                label: alert.title,
                color: "#E91E63",
                detail: alert.location,
              },
            ]}
          />
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
            <MapPin className="h-3.5 w-3.5 text-pink" /> Pulsing marker shows last known position
          </p>
        </Panel>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Verify", icon: CheckCircle2, className: "bg-white text-navy border border-border" },
          { label: "Call Guardian", icon: Phone, className: "bg-white text-navy border border-border" },
          { label: "Alert Police", icon: Siren, className: "bg-sky-deep text-white" },
          { label: "Send Nearby Support", icon: Users, className: "bg-mint text-white" },
        ].map((a) => {
          const Icon = a.icon
          return (
            <button
              key={a.label}
              className={`flex items-center justify-center gap-2 rounded-[14px] px-4 py-4 text-sm font-bold shadow-[var(--shadow-soft)] transition hover:opacity-95 ${a.className}`}
            >
              <Icon className="h-4 w-4" />
              {a.label}
            </button>
          )
        })}
      </div>

      <Panel title="Notes">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Add verification notes, guardian updates, or escalation details…"
          className="w-full resize-none rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none focus:border-sky focus:ring-2 focus:ring-sky/20"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <Shield className="h-3.5 w-3.5 text-sky-deep" /> Notes are visible to response operators
          </p>
          <button className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white hover:bg-navy-2">
            Save
          </button>
        </div>
      </Panel>
    </div>
  )
}
