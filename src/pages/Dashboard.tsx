import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  Users,
  Watch,
} from "lucide-react"
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

const layers = [
  { id: "Overview", hint: "Summary" },
  { id: "Live Map", hint: "GPS" },
  { id: "Alerts", hint: "Queue" },
] as const

function greetingFor(date: Date) {
  const h = date.getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

export function Dashboard() {
  const [layer, setLayer] = useState<(typeof layers)[number]["id"]>("Overview")
  const now = useMemo(() => new Date(), [])
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

  const safeCount = mapPoints.filter((p) => p.type === "safe" || p.type === "protected").length
  const alertCount = alerts.filter((a) => a.severity !== "low").length

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Hero welcome */}
      <section className="relative overflow-hidden rounded-3xl border border-[#e5a0b4] bg-gradient-to-br from-white via-[#fff7fa] to-[#ffe4ef] p-5 shadow-[0_14px_40px_rgba(233,30,99,0.08)] sm:p-7">
        <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-pink/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-sky/10 blur-3xl" />

        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#e5a0b4] bg-white/80 px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-pink uppercase">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" />
              Protection centre · Live
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#3d1f2c] sm:text-[2rem]">
              {greetingFor(now)}, Ahamed
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#8a6b78] sm:text-[15px]">
              Your Life Bridge network is active — {safeCount} safe zones online, {alertCount} alerts need a
              quick look.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                { to: "/map", label: "Open live map", icon: MapPin },
                { to: "/guardians", label: "Guardians", icon: Users },
                { to: "/device", label: "Devices", icon: Watch },
              ].map((a) => {
                const Icon = a.icon
                return (
                  <Link
                    key={a.to}
                    to={a.to}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#e5a0b4] bg-white px-3.5 py-2 text-xs font-semibold text-[#3d1f2c] shadow-sm transition hover:border-pink hover:bg-[#fff0f5] hover:text-pink"
                  >
                    <Icon className="h-3.5 w-3.5 text-pink" />
                    {a.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-50" />
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[#e5a0b4] bg-white/90 px-5 py-4 shadow-sm backdrop-blur">
            <p className="text-[11px] font-bold tracking-wide text-[#b0899a] uppercase">Today</p>
            <p className="mt-1 text-base font-bold text-[#3d1f2c]">{date}</p>
            <p className="text-sm tabular-nums text-[#8a6b78]">{time}</p>
            <div className="mt-3 h-px bg-[#efc2d0]" />
            <p className="mt-3 text-xs font-medium text-[#8a6b78]">
              Network health{" "}
              <span className="font-bold text-mint">98%</span>
            </p>
          </div>
        </div>
      </section>

      {/* Layer tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-2xl border border-[#e5a0b4] bg-white p-1.5 shadow-sm">
          {layers.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setLayer(tab.id)}
              className={`min-w-[6.5rem] rounded-xl px-4 py-2.5 text-left transition ${
                layer === tab.id
                  ? "bg-gradient-to-br from-pink to-pink-deep text-white shadow-[0_8px_20px_rgba(233,30,99,0.3)]"
                  : "text-[#8a6b78] hover:bg-[#fff5f8] hover:text-[#3d1f2c]"
              }`}
            >
              <span className="block text-[13px] font-bold">{tab.id}</span>
              <span className={`block text-[10px] font-medium ${layer === tab.id ? "text-white/75" : "text-[#b0899a]"}`}>
                {tab.hint}
              </span>
            </button>
          ))}
        </div>
        <p className="text-xs font-medium text-[#b0899a]">Fear2Safe Life Bridge · Sri Lanka node</p>
      </div>

      {(layer === "Overview" || layer === "Live Map") && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatusCard
            value={245}
            label="All Safe"
            hint="People currently protected"
            tone="mint"
            icon={<ShieldCheck className="h-5 w-5" />}
          />
          <StatusCard
            value={3}
            label="Need Attention"
            hint="Open high-priority alerts"
            tone="pink"
            icon={<AlertTriangle className="h-5 w-5" />}
          />
          <StatusCard
            value={12}
            label="Under Verification"
            hint="Awaiting guardian review"
            tone="sky"
            icon={<Clock3 className="h-5 w-5" />}
          />
        </div>
      )}

      <div className={`grid gap-5 ${layer === "Overview" ? "xl:grid-cols-[1.45fr_1fr]" : ""}`}>
        {(layer === "Overview" || layer === "Live Map") && (
          <Panel
            flush
            title="Live Protection Map"
            action={
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ecfdf5] px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#059669] uppercase ring-1 ring-[#a7f3d0]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#059669]" />
                  Live GPS
                </span>
                <Link
                  to="/map"
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-pink transition hover:bg-[#fff0f5]"
                >
                  Full map <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            }
          >
            <GoogleLiveMap
              markers={markers}
              className={`rounded-none border-0 border-t border-[#efc2d0] ${
                layer === "Live Map" ? "h-[min(62vh,520px)]" : "h-[380px]"
              }`}
              fallbackCenter={{ lat: 6.9271, lng: 79.8612 }}
              zoom={13}
              showLiveUser
            />
            <div className="flex flex-wrap gap-3 border-t border-[#efc2d0] bg-[#fffafb] px-4 py-2.5 text-[11px] font-medium text-[#8a6b78]">
              {[
                ["Alert", "#E91E63"],
                ["Protected", "#29B6F6"],
                ["Guardian", "#0B1F33"],
                ["Safe zone", "#22C55E"],
                ["You (live)", "#E91E63"],
              ].map(([label, color]) => (
                <span key={label} className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                  {label}
                </span>
              ))}
            </div>
          </Panel>
        )}

        {(layer === "Overview" || layer === "Alerts") && (
          <Panel
            title="Recent Alerts"
            action={
              <Link
                to="/alerts/risk-detected"
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-pink hover:bg-[#fff0f5]"
              >
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          >
            <ul className="space-y-3">
              {alerts.map((a, i) => (
                <li key={a.id} className="relative">
                  {i < alerts.length - 1 && (
                    <span className="absolute top-12 left-5 h-[calc(100%-0.5rem)] w-px bg-[#efc2d0]" />
                  )}
                  <Link
                    to={`/alerts/${a.id}`}
                    className="relative flex gap-3.5 rounded-2xl border border-[#e5a0b4] bg-gradient-to-r from-[#fffafb] to-white p-4 transition hover:border-pink hover:shadow-[0_8px_24px_rgba(233,30,99,0.1)]"
                  >
                    <div
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${
                        a.severity === "high"
                          ? "bg-gradient-to-br from-pink to-pink-deep text-white"
                          : a.severity === "medium"
                            ? "bg-[#fff7ed] text-[#d97706] ring-1 ring-[#fdba74]"
                            : "bg-[#ecfdf5] text-[#059669] ring-1 ring-[#6ee7b7]"
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
                      <p className="mt-1 truncate text-xs font-medium text-[#8a6b78]">{a.person}</p>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-[#9a7382]">
                        <MapPin className="h-3 w-3 shrink-0 text-pink" />
                        {a.location}
                      </p>
                      <p className="mt-2 text-[11px] font-semibold tracking-wide text-[#b0899a] uppercase">
                        {a.time}
                      </p>
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
