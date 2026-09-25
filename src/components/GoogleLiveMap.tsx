import { useCallback, useEffect, useMemo, useState } from "react"
import { GoogleMap, MarkerF, CircleF, useJsApiLoader } from "@react-google-maps/api"
import {
  Layers,
  LocateFixed,
  MapPin,
  Minus,
  Navigation,
  Plus,
  ShieldCheck,
  TriangleAlert,
  UsersRound,
  Clock3,
} from "lucide-react"

export type LiveMapMarker = {
  id: string
  lat: number
  lng: number
  label: string
  color: string
  detail?: string
}

export type MapConsoleStats = {
  connected: number
  total: number
  attention: number
  verify: number
  safeZones: number
}

type GoogleLiveMapProps = {
  markers?: LiveMapMarker[]
  className?: string
  fallbackCenter?: { lat: number; lng: number }
  zoom?: number
  showLiveUser?: boolean
  onMarkerClick?: (marker: LiveMapMarker) => void
  hideFloatingStats?: boolean
  /** Rich Live Map page overlays */
  consoleMode?: boolean
  consoleStats?: MapConsoleStats
  selectedId?: string | null
  followLive?: boolean
  focusTarget?: { lat: number; lng: number } | null
  showSafeZoneCircles?: boolean
  onLiveChange?: (live: { lat: number; lng: number; accuracy: number } | null) => void
  onSelectSelf?: () => void
}

const mapContainerStyle = { width: "100%", height: "100%" }

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#F5F9FC" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#486174" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#DCE6EE" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#DCEFFA" }] },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#DCE6EE" }],
  },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#F5F9FC" }] },
]

function statusMeta(detail?: string) {
  switch (detail) {
    case "alert":
      return { badge: "ALERT", accent: "#F2385A", soft: "#FFF1F4" }
    case "attention":
      return { badge: "ATTENTION", accent: "#F5A214", soft: "#FFF8E9" }
    case "verify":
      return { badge: "VERIFY", accent: "#F5A214", soft: "#FFF8E9" }
    case "guardian":
      return { badge: "GUARD", accent: "#009FA5", soft: "#ECFBF5" }
    case "safe":
      return { badge: "SAFE", accent: "#18C6EA", soft: "#E8FAFC" }
    case "protected":
    default:
      return { badge: "ONLINE", accent: "#14B882", soft: "#ECFBF5" }
  }
}

function buildMarkerIcon(label: string, _color: string, detail?: string): google.maps.Icon {
  const meta = statusMeta(detail)
  const initial = (label.trim()[0] || "?").toUpperCase()
  const short = label.length > 10 ? `${label.slice(0, 9)}…` : label
  const w = 118
  const h = 52

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#3d1f2c" flood-opacity="0.22"/>
    </filter>
  </defs>
  <rect x="2" y="2" width="114" height="40" rx="12" fill="#ffffff" stroke="${meta.accent}" stroke-width="2" filter="url(#s)"/>
  <circle cx="22" cy="22" r="12" fill="${meta.accent}"/>
  <text x="22" y="26" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-size="12" font-weight="700" fill="#ffffff">${initial}</text>
  <text x="40" y="18" font-family="Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" fill="#102A43">${escapeXml(short)}</text>
  <rect x="40" y="24" width="52" height="12" rx="6" fill="${meta.soft}"/>
  <text x="66" y="33" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-size="7.5" font-weight="700" fill="${meta.accent}">${meta.badge}</text>
  <path d="M59 42 L66 50 L73 42 Z" fill="${meta.accent}"/>
</svg>`.trim()

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(w, h),
    anchor: new google.maps.Point(w / 2, h - 2),
  }
}

function buildLiveUserIcon(): google.maps.Icon {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="148" height="54" viewBox="0 0 148 54">
  <defs>
    <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#3d1f2c" flood-opacity="0.22"/>
    </filter>
  </defs>
  <rect x="2" y="2" width="144" height="40" rx="12" fill="#007F86" stroke="#ffffff" stroke-width="2.5" filter="url(#s)"/>
  <circle cx="22" cy="22" r="8" fill="#ffffff">
    <animate attributeName="opacity" values="1;0.45;1" dur="1.2s" repeatCount="indefinite"/>
  </circle>
  <text x="38" y="20" font-family="Segoe UI,Arial,sans-serif" font-size="11" font-weight="800" fill="#ffffff">MY DEVICE · LIVE</text>
  <text x="38" y="34" font-family="Segoe UI,Arial,sans-serif" font-size="9" font-weight="600" fill="#DCEFFA">Live Location</text>
  <path d="M70 42 L77 50 L84 42 Z" fill="#007F86"/>
</svg>`.trim()

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(148, 54),
    anchor: new google.maps.Point(74, 52),
  }
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

export function GoogleLiveMap({
  markers = [],
  className = "h-[340px]",
  fallbackCenter = { lat: 7.8731, lng: 80.7718 },
  zoom = 13,
  showLiveUser = true,
  onMarkerClick,
  hideFloatingStats = false,
  consoleMode = false,
  consoleStats,
  selectedId = null,
  followLive = true,
  focusTarget = null,
  showSafeZoneCircles = false,
  onLiveChange,
  onSelectSelf,
}: GoogleLiveMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string
  const { isLoaded, loadError } = useJsApiLoader({
    id: "fear2safe-google-maps",
    googleMapsApiKey: apiKey || "",
  })

  const [live, setLive] = useState<{ lat: number; lng: number; accuracy: number } | null>(null)
  const [liveError, setLiveError] = useState<string | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)

  useEffect(() => {
    if (!showLiveUser) {
      setLiveError(null)
      setLive(null)
      return
    }
    if (!navigator.geolocation) {
      setLiveError("Geolocation not available")
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const next = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy || 40,
        }
        setLive(next)
        setUpdatedAt(new Date())
        setLiveError(null)
        onLiveChange?.(next)
      },
      (err) => {
        setLiveError(err.message || "Location permission needed")
        onLiveChange?.(null)
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [showLiveUser, onLiveChange])

  const center = live ?? (markers[0] ? { lat: markers[0].lat, lng: markers[0].lng } : fallbackCenter)

  useEffect(() => {
    if (!map) return
    if (focusTarget) {
      map.panTo(focusTarget)
      map.setZoom(Math.max(map.getZoom() ?? 14, 15))
      return
    }
    if (followLive && live) {
      map.panTo(live)
      return
    }
    if (!consoleMode && markers.length > 1) {
      const bounds = new google.maps.LatLngBounds()
      markers.forEach((m) => bounds.extend({ lat: m.lat, lng: m.lng }))
      map.fitBounds(bounds, 48)
    }
  }, [map, live, markers, followLive, focusTarget, consoleMode])

  const onLoad = useCallback((m: google.maps.Map) => setMap(m), [])

  useEffect(() => {
    if (!map) return
    const el = map.getDiv()?.parentElement
    if (!el || typeof ResizeObserver === "undefined") {
      google.maps.event.trigger(map, "resize")
      return
    }
    const ro = new ResizeObserver(() => {
      google.maps.event.trigger(map, "resize")
      if (focusTarget) map.panTo(focusTarget)
      else if (followLive && live) map.panTo(live)
      else if (markers[0]) map.panTo({ lat: markers[0].lat, lng: markers[0].lng })
    })
    ro.observe(el)
    google.maps.event.trigger(map, "resize")
    return () => ro.disconnect()
  }, [map, focusTarget, followLive, live, markers])

  const options = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: consoleMode,
      zoomControl: !consoleMode,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      clickableIcons: false,
      styles: MAP_STYLES,
      gestureHandling: "greedy",
    }),
    [consoleMode],
  )

  const counts = useMemo(() => {
    let attention = 0
    let verify = 0
    for (const m of markers) {
      if (m.detail === "alert" || m.detail === "attention") attention += 1
      else if (m.detail === "verify") verify += 1
    }
    const total = markers.length || 5
    return { total, attention, verify }
  }, [markers])

  const stats = consoleStats ?? {
    connected: counts.total,
    total: counts.total,
    attention: counts.attention,
    verify: counts.verify,
    safeZones: 0,
  }

  if (loadError) {
    return (
      <div
        className={`flex items-center justify-center rounded-[14px] border border-[#DCE6EE] bg-[#DCEFFA] text-sm text-[#007F86] ${className}`}
      >
        Google Maps failed to load. Check API key & Maps JavaScript API.
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div
        className={`flex items-center justify-center rounded-[14px] border border-[#DCE6EE] bg-[#F5F9FC] text-sm text-[#486174] ${className}`}
      >
        Loading live map…
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-[14px] border border-[#DCE6EE] ${className}`}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        options={options}
        onLoad={onLoad}
      >
        {markers.map((m) => (
          <MarkerF
            key={m.id}
            position={{ lat: m.lat, lng: m.lng }}
            title={`${m.label} · ${m.detail ?? "online"}`}
            icon={buildMarkerIcon(m.label, m.color, m.detail)}
            cursor={onMarkerClick ? "pointer" : undefined}
            onClick={() => onMarkerClick?.(m)}
            zIndex={selectedId === m.id ? 999 : 10}
          />
        ))}

        {markers
          .filter((m) => m.detail === "alert" || m.detail === "attention" || m.detail === "verify")
          .map((m) => {
            const accent =
              m.detail === "alert" ? "#F2385A" : m.detail === "verify" ? "#3478F6" : "#F5A214"
            return (
              <CircleF
                key={`pulse-${m.id}`}
                center={{ lat: m.lat, lng: m.lng }}
                radius={160}
                options={{
                  fillColor: accent,
                  fillOpacity: 0.1,
                  strokeColor: accent,
                  strokeOpacity: 0.35,
                  strokeWeight: 1.5,
                }}
              />
            )
          })}

        {showSafeZoneCircles &&
          markers
            .filter((m) => m.detail === "safe" || m.detail === "protected")
            .map((m) => (
              <CircleF
                key={`zone-${m.id}`}
                center={{ lat: m.lat, lng: m.lng }}
                radius={220}
                options={{
                  fillColor: "#00B0B9",
                  fillOpacity: 0.07,
                  strokeColor: "#00B0B9",
                  strokeOpacity: 0.28,
                  strokeWeight: 1,
                }}
              />
            ))}

        {live && (
          <>
            <MarkerF
              position={live}
              title="My Device · Live Location"
              icon={buildLiveUserIcon()}
              onClick={() => onSelectSelf?.()}
              zIndex={1000}
            />
            <CircleF
              center={live}
              radius={300}
              options={{
                fillColor: "#00B0B9",
                fillOpacity: 0.08,
                strokeColor: "#00B0B9",
                strokeOpacity: 0.22,
                strokeWeight: 1,
              }}
            />
            <CircleF
              center={live}
              radius={Math.max(live.accuracy, 80)}
              options={{
                fillColor: "#00B0B9",
                fillOpacity: 0.18,
                strokeColor: "#00B0B9",
                strokeOpacity: 0.35,
                strokeWeight: 1.5,
              }}
            />
          </>
        )}
      </GoogleMap>

      {!(hideFloatingStats && !showLiveUser) ? (
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/95 px-2.5 py-1 text-[11px] font-bold text-navy shadow-sm backdrop-blur">
          <span className={`h-2 w-2 rounded-full ${live ? "animate-pulse bg-mint" : "bg-orange"}`} />
          {live ? "LIVE GPS" : "WAITING GPS"}
        </span>
        {(consoleMode || hideFloatingStats) && showLiveUser ? (
          <button
            type="button"
            className="rounded-full border border-white/80 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#486174] shadow-sm backdrop-blur"
            onClick={() => onSelectSelf?.()}
          >
            You · My Device
          </button>
        ) : null}
        {!consoleMode && !hideFloatingStats && onMarkerClick ? (
          <span className="rounded-full border border-white/80 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#486174] shadow-sm backdrop-blur">
            Click user → vitals
          </span>
        ) : null}
        {live && (
          <span className="inline-flex items-center gap-1 rounded-full border border-white/80 bg-white/95 px-2.5 py-1 text-[11px] font-medium text-muted shadow-sm backdrop-blur">
            <Navigation className="h-3 w-3 text-[#007F86]" />
            {live.lat.toFixed(5)}, {live.lng.toFixed(5)}
          </span>
        )}
      </div>
      ) : null}

      {consoleMode ? (
        <div className="f2s-lm-float-stats absolute top-3 right-3 z-10">
          <div className="f2s-lm-float tone-green">
            <UsersRound className="h-3.5 w-3.5" />
            <div>
              <p className="lbl">Connected</p>
              <p className="val">
                {stats.connected}/{stats.total}
              </p>
              <p className="sub">Users Online</p>
            </div>
          </div>
          <div className="f2s-lm-float tone-orange">
            <TriangleAlert className="h-3.5 w-3.5" />
            <div>
              <p className="lbl">Attention</p>
              <p className="val">{stats.attention}</p>
              <p className="sub">Needs Review</p>
            </div>
          </div>
          <div className="f2s-lm-float tone-red">
            <Clock3 className="h-3.5 w-3.5" />
            <div>
              <p className="lbl">Verify</p>
              <p className="val">{stats.verify}</p>
              <p className="sub">Pending</p>
            </div>
          </div>
          <div className="f2s-lm-float tone-blue">
            <ShieldCheck className="h-3.5 w-3.5" />
            <div>
              <p className="lbl">Safe Zones</p>
              <p className="val">{stats.safeZones}</p>
              <p className="sub">Active</p>
            </div>
          </div>
        </div>
      ) : (
        !hideFloatingStats && (
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 sm:flex-row">
            <div className="rounded-2xl border border-[#BBF7D0] bg-[#ECFDF5]/95 px-3 py-2 shadow-md backdrop-blur">
              <p className="text-[10px] font-bold tracking-wide text-[#22C55E] uppercase">Connected</p>
              <p className="text-lg font-extrabold tabular-nums text-[#22C55E]">
                {counts.total}/{counts.total}
              </p>
            </div>
            <div className="rounded-2xl border border-[#FECDD3] bg-[#FFF1F2]/95 px-3 py-2 shadow-md backdrop-blur">
              <p className="text-[10px] font-bold tracking-wide text-[#FF4D5A] uppercase">Attention</p>
              <p className="text-lg font-extrabold tabular-nums text-[#FF4D5A]">{counts.attention}</p>
            </div>
            <div className="rounded-2xl border border-[#FDE68A] bg-[#FFF8E8]/95 px-3 py-2 shadow-md backdrop-blur">
              <p className="text-[10px] font-bold tracking-wide text-[#F6B73C] uppercase">Verify</p>
              <p className="text-lg font-extrabold tabular-nums text-[#F6B73C]">{counts.verify}</p>
            </div>
          </div>
        )
      )}

      {consoleMode && (
        <div className="f2s-lm-map-controls absolute top-1/2 right-3 z-10 -translate-y-1/2">
          <button type="button" aria-label="Layers" title="Layers">
            <Layers className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Recenter"
            onClick={() => {
              if (live) {
                map?.panTo(live)
                map?.setZoom(15)
              }
            }}
          >
            <LocateFixed className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Zoom in" onClick={() => map?.setZoom((map.getZoom() ?? 14) + 1)}>
            <Plus className="h-4 w-4" />
          </button>
          <button type="button" aria-label="Zoom out" onClick={() => map?.setZoom((map.getZoom() ?? 14) - 1)}>
            <Minus className="h-4 w-4" />
          </button>
        </div>
      )}

      {showLiveUser ? (
      <div className="absolute bottom-3 left-3 z-10 max-w-[280px] rounded-xl border border-white/80 bg-white/95 px-3 py-2 text-[11px] shadow-sm backdrop-blur">
        {live ? (
          <p className="flex items-center gap-1.5 font-medium text-navy">
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#14B882]" />
            Live location updates
            {updatedAt
              ? ` · ${updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
              : ""}
          </p>
        ) : (
          <p className="flex items-start gap-1.5 font-medium text-muted">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#007F86]" />
            {liveError || "Allow location access for live tracking"}
          </p>
        )}
      </div>
      ) : null}

      {(consoleMode || hideFloatingStats) && (
        <div className="f2s-lm-legend absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
          <span>
            <i style={{ background: "#149FE8" }} /> User
          </span>
          <span>
            <i className="ring" style={{ borderColor: "#00B0B9" }} /> Safe Zone
          </span>
          <span>
            <i style={{ background: "#009FA5" }} /> Guardian
          </span>
          <span>
            <i style={{ background: "#F2385A" }} /> Active Alert
          </span>
          <span>
            <i style={{ background: "#F5A214" }} /> Verification
          </span>
        </div>
      )}
    </div>
  )
}
