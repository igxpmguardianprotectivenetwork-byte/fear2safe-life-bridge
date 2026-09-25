import {
  BarChart3,
  BatteryMedium,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  Crosshair,
  Layers,
  LocateFixed,
  Map as MapIcon,
  MapPin,
  Navigation,
  Route,
  ShieldCheck,
  TriangleAlert,
  UsersRound,
  Watch,
} from "lucide-react"
import { Link } from "react-router-dom"
import type { ReactNode } from "react"
import type { MapFilter } from "./liveMapState"
import { MAP_FILTERS, deviceForPoint, getLiveMapNetworkStats, statusLabel } from "./liveMapState"
import { mapPoints } from "../../data/mock"
import { UserAvatar } from "../UserAvatar"

const filterIcons: Record<MapFilter, ReactNode> = {
  All: <Layers className="h-3.5 w-3.5" />,
  Alerts: <Bell className="h-3.5 w-3.5" />,
  Protected: <ShieldCheck className="h-3.5 w-3.5" />,
  Guardians: <UsersRound className="h-3.5 w-3.5" />,
  "Safe Zones": <MapPin className="h-3.5 w-3.5" />,
  Heatmap: <BarChart3 className="h-3.5 w-3.5" />,
  Routes: <Route className="h-3.5 w-3.5" />,
  Devices: <Watch className="h-3.5 w-3.5" />,
}

export function LiveMapHeader({
  dateLabel,
  timeLabel,
}: {
  dateLabel: string
  timeLabel: string
}) {
  return (
    <header className="f2s-lm-header">
      <div className="f2s-lm-header-left min-w-0">
        <span className="f2s-lm-title-icon">
          <MapIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h1>Live Map</h1>
          <p>Real-time location tracking, safety monitoring and incident management</p>
        </div>
      </div>
      <div className="f2s-lm-header-right">
        <div className="f2s-lm-sys">
          <span className="f2s-lm-dot" />
          <div>
            <p className="f2s-lm-sys-title">System Online</p>
            <p className="f2s-lm-sys-sub">All services operational</p>
          </div>
        </div>
        <div className="f2s-lm-datetime">
          <span>
            <CalendarDays className="h-3.5 w-3.5" />
            {dateLabel}
          </span>
          <span>
            <Clock3 className="h-3.5 w-3.5" />
            {timeLabel}
          </span>
        </div>
      </div>
    </header>
  )
}

export function MapFilterToolbar({
  query,
  onQuery,
  filter,
  onFilter,
}: {
  query: string
  onQuery: (v: string) => void
  filter: MapFilter
  onFilter: (f: MapFilter) => void
}) {
  return (
    <div className="f2s-lm-toolbar">
      <div className="f2s-lm-search">
        <Crosshair className="f2s-lm-search-icon" aria-hidden />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search people, devices, locations, or safe zones..."
          aria-label="Search map"
        />
      </div>
      <div className="f2s-lm-filters" role="tablist" aria-label="Map filters">
        {MAP_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            disabled={!f.enabled}
            title={f.enabled ? f.label : f.reason}
            className={`f2s-lm-filter ${filter === f.id ? "is-active" : ""} ${!f.enabled ? "is-disabled" : ""}`}
            onClick={() => f.enabled && onFilter(f.id)}
          >
            {filterIcons[f.id]}
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function SelectedUserPanel({
  selectedId,
  liveCoords,
  liveAccuracy,
  nearby,
  onSelect,
}: {
  selectedId: string | null
  liveCoords: { lat: number; lng: number } | null
  liveAccuracy: number | null
  nearby: { id: string; label: string; detail?: string; distanceKm: number }[]
  onSelect: (id: string) => void
}) {
  const isSelf = !selectedId || selectedId === "self"
  const point = selectedId && selectedId !== "self" ? mapPoints.find((p) => p.id === selectedId) : null
  const device = point ? deviceForPoint(point.id) : null

  const name = isSelf ? "My Device" : point?.label ?? "Unknown"
  const role = isSelf ? "You · Live Location" : device?.name ?? "Protected member"
  const coords = isSelf
    ? liveCoords
    : point
      ? { lat: point.lat, lng: point.lng }
      : null
  const battery = isSelf ? 96 : device?.battery ?? null
  const lastSeen = isSelf ? "Just now" : device?.lastSync ?? "—"
  const accuracy = isSelf
    ? liveAccuracy != null
      ? `${Math.round(liveAccuracy)} m`
      : "—"
    : device?.gpsAccuracy
      ? device.gpsAccuracy === "High"
        ? "8 m"
        : device.gpsAccuracy === "Medium"
          ? "25 m"
          : "60 m"
      : "—"
  const inSafeZone = isSelf ? true : Boolean(device?.safeZone)
  const zoneName = isSelf
    ? liveCoords
      ? "Live GPS · Current Location"
      : "Waiting for live GPS…"
    : device?.location?.split("·")[0]?.trim() || "Monitored zone"

  return (
    <aside className="f2s-lm-side">
      <div className="f2s-lm-side-head">
        <h2>Selected User</h2>
        <ChevronDown className="h-4 w-4 text-[#6B8098]" aria-hidden />
      </div>

      <div className="f2s-lm-user-card">
        <div className="f2s-lm-user-top">
          {isSelf ? (
            <div className="f2s-lm-avatar self">AH</div>
          ) : (
            <UserAvatar userId={point!.id} label={point!.label} size="md" />
          )}
          <div className="min-w-0 flex-1">
            <p className="f2s-lm-user-name">{name}</p>
            <p className="f2s-lm-user-role">{role}</p>
            <span className="f2s-lm-online">
              <span className="dot" />
              Online
            </span>
          </div>
        </div>

        <div className="f2s-lm-user-rows">
          <div>
            <Navigation className="h-3.5 w-3.5" />
            <span>
              {coords
                ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
                : "Waiting for GPS…"}
            </span>
          </div>
          <div>
            <BatteryMedium className="h-3.5 w-3.5" />
            <span>
              {battery != null ? `${battery}%` : "—"}
              <em>Last seen: {lastSeen}</em>
            </span>
          </div>
          <div>
            <LocateFixed className="h-3.5 w-3.5" />
            <span>Accuracy: {accuracy}</span>
          </div>
        </div>

        <div className={`f2s-lm-zone ${inSafeZone ? "is-in" : "is-out"}`}>
          <ShieldCheck className="h-4 w-4" />
          <div className="min-w-0 flex-1">
            <p>{inSafeZone ? "Within Safe Zone" : "Outside Safe Zone"}</p>
            <span>{zoneName}</span>
          </div>
          <ChevronRight className="h-4 w-4 opacity-60" />
        </div>

        {!isSelf && point ? (
          <Link to={`/dashboard?tab=vitals&user=${point.id}`} className="f2s-lm-vitals-link">
            Open Care Console
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>

      <div className="f2s-lm-nearby-head">
        <h3>Nearby Users ({nearby.length})</h3>
        <Link to="/dashboard?tab=vitals" className="f2s-lm-viewall">
          View All
        </Link>
      </div>
      <ul className="f2s-lm-nearby">
        {nearby.map((n) => (
          <li key={n.id}>
            <button type="button" onClick={() => onSelect(n.id)}>
              <span
                className="f2s-lm-nearby-dot"
                style={{
                  background:
                    n.detail === "alert"
                      ? "#F2385A"
                      : n.detail === "verify" || n.detail === "attention"
                        ? "#F5A214"
                        : n.detail === "safe"
                          ? "#18C6EA"
                          : "#14B882",
                }}
              />
              <UserAvatar userId={n.id} label={n.label} size="sm" />
              <span className="min-w-0 flex-1 text-left">
                <strong>{n.label}</strong>
                <em>
                  {statusLabel(n.detail)} ·{" "}
                  {n.distanceKm < 1
                    ? `${(n.distanceKm * 1000).toFixed(0)} m`
                    : `${n.distanceKm.toFixed(1)} km`}
                </em>
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-[#6B8098]" />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export function NetworkSummaryStrip() {
  const s = getLiveMapNetworkStats()
  const items = [
    {
      label: "Active Incidents",
      value: String(s.activeIncidents),
      tone: "red" as const,
      icon: <TriangleAlert className="h-4 w-4" />,
      to: "/alerts/risk-detected",
    },
    {
      label: "Connected Users",
      value: `${s.connected}/${s.total}`,
      tone: "green" as const,
      icon: <UsersRound className="h-4 w-4" />,
      to: "/dashboard?tab=vitals",
    },
    {
      label: "Verification Queue",
      value: String(s.verify),
      tone: "orange" as const,
      icon: <Clock3 className="h-4 w-4" />,
      to: "/alerts/risk-detected",
    },
    {
      label: "Safe Zones",
      value: String(s.safeZones),
      tone: "blue" as const,
      icon: <ShieldCheck className="h-4 w-4" />,
      to: "/map",
    },
    {
      label: "Active Routes",
      value: String(s.activeRoutes),
      tone: "purple" as const,
      icon: <Route className="h-4 w-4" />,
      to: undefined as string | undefined,
    },
  ]

  return (
    <div className="f2s-lm-summary">
      {items.map((item) => {
        const inner = (
          <>
            <span className={`f2s-lm-sum-icon tone-${item.tone}`}>{item.icon}</span>
            <div className="min-w-0">
              <p className="f2s-lm-sum-value">{item.value}</p>
              <p className="f2s-lm-sum-label">{item.label}</p>
            </div>
            <ChevronRight className="ml-auto h-4 w-4 text-[#6B8098]" />
          </>
        )
        return item.to ? (
          <Link key={item.label} to={item.to} className="f2s-lm-sum-item">
            {inner}
          </Link>
        ) : (
          <div key={item.label} className="f2s-lm-sum-item is-static" title="No active routes">
            {inner}
          </div>
        )
      })}
    </div>
  )
}
