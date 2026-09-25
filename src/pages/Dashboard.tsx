import { useState } from "react"
import { Link } from "react-router-dom"
import { AlertTriangle, CheckCircle2, Clock3, ShieldCheck } from "lucide-react"
import { alerts, mapPoints } from "../data/mock"
import { GoogleLiveMap } from "../components/GoogleLiveMap"
import { Panel, SeverityBadge, StatusCard } from "../components/ui"

const markerColors = {
  alert: "#E91E63",
  protected: "#29B6F6",
  guardian: "#0B1F33",
  safe: "#22C55E",
  verify: "#4FC3F7",
}

const layers = ["Overview", "Live Map", "Alerts"] as const

export function Dashboard() {
  const [layer, setLayer] = useState<(typeof layers)[number]>("Overview")
  const now = new Date()
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const date = now.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })

  const markers = mapPoints.map((p) => ({
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    label: p.label,
    color: markerColors[p.type],
    detail: p.type,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-[#b0899a] uppercase">
            Protection centre
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#3d1f2c] sm:text-[1.75rem]">
            Good Afternoon, Ahamed
          </h1>
        </div>
        <div className="rounded-2xl border border-[#e5a0b4] bg-white px-5 py-3 shadow-[0_1px_2px_rgba(61,31,44,0.04)]">
          <p className="text-sm font-bold text-[#3d1f2c]">{date}</p>
          <p className="text-xs text-[#8a6b78] tabular-nums">{time} · Live protection</p>
        </div>
      </div>

      {/* Professional layer tabs */}
      <div className="inline-flex rounded-2xl border-2 border-[#e5a0b4] bg-white p-1 shadow-[0_1px_2px_rgba(61,31,44,0.04)]">
        {layers.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setLayer(tab)}
            className={`rounded-xl px-4 py-2 text-[13px] font-semibold transition ${
              layer === tab
                ? "bg-pink text-white shadow-[0_6px_16px_rgba(233,30,99,0.28)]"
                : "text-[#8a6b78] hover:bg-[#fff5f8] hover:text-[#3d1f2c]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {(layer === "Overview" || layer === "Live Map") && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatusCard
            value={245}
            label="All Safe"
            hint="Protected network"
            tone="mint"
            icon={<ShieldCheck className="h-5 w-5" />}
          />
          <StatusCard
            value={3}
            label="Need Attention"
            hint="Open alerts"
            tone="pink"
            icon={<AlertTriangle className="h-5 w-5" />}
          />
          <StatusCard
            value={12}
            label="Under Verification"
            hint="In review"
            tone="sky"
            icon={<Clock3 className="h-5 w-5" />}
          />
        </div>
      )}

      <div
        className={`grid gap-5 ${
          layer === "Overview" ? "xl:grid-cols-[1.4fr_1fr]" : "grid-cols-1"
        }`}
      >
        {(layer === "Overview" || layer === "Live Map") && (
          <Panel
            title="Live Protection Map"
            action={
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf5] px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#059669] uppercase ring-1 ring-[#a7f3d0]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#059669]" />
                  Live GPS
                </span>
                <Link
                  to="/map"
                  className="rounded-lg px-2.5 py-1 text-xs font-semibold text-pink hover:bg-[#fff0f5]"
                >
                  Full map
                </Link>
              </div>
            }
          >
            <GoogleLiveMap
              markers={markers}
              className={`border-0 ${layer === "Live Map" ? "h-[480px]" : "h-[360px]"}`}
              fallbackCenter={{ lat: 6.9271, lng: 79.8612 }}
              zoom={13}
              showLiveUser
            />
          </Panel>
        )}

        {(layer === "Overview" || layer === "Alerts") && (
          <Panel
            title="Recent Alerts"
            action={
              <Link
                to="/alerts/risk-detected"
                className="rounded-lg px-2.5 py-1 text-xs font-semibold text-pink hover:bg-[#fff0f5]"
              >
                View all
              </Link>
            }
          >
            <ul className="space-y-2.5">
              {alerts.map((a) => (
                <li key={a.id}>
                  <Link
                    to={`/alerts/${a.id}`}
                    className="flex gap-3 rounded-xl border-2 border-[#efc2d0] bg-[#fffafb] p-3.5 transition hover:border-pink/50 hover:bg-[#fff0f5]"
                  >
                    <div
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        a.severity === "high"
                          ? "bg-[#fff0f5] text-pink"
                          : a.severity === "medium"
                            ? "bg-[#fffbeb] text-[#d97706]"
                            : "bg-[#ecfdf5] text-[#059669]"
                      }`}
                    >
                      {a.severity === "low" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-bold text-[#3d1f2c]">{a.title}</p>
                        <SeverityBadge severity={a.severity} />
                      </div>
                      <p className="mt-0.5 truncate text-xs text-[#8a6b78]">{a.person}</p>
                      <p className="truncate text-xs text-[#8a6b78]">{a.location}</p>
                      <p className="mt-1 text-[11px] font-medium text-[#b0899a]">{a.time}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
    </div>
  )
}
