import { useCallback, useEffect, useMemo, useState } from "react"
import { GoogleLiveMap } from "../components/GoogleLiveMap"
import {
  LiveMapHeader,
  MapFilterToolbar,
  NetworkSummaryStrip,
  SelectedUserPanel,
} from "../components/liveMap/LiveMapPageParts"
import {
  conditionToMarkerDetail,
  filterMapPoints,
  getLiveMapNetworkStats,
  haversineKm,
  type MapFilter,
} from "../components/liveMap/liveMapState"
import { mapPoints } from "../data/mock"
import { useWatchLive } from "../lib/useWatchLive"

const markerColors: Record<string, string> = {
  alert: "#F2385A",
  attention: "#F5A214",
  protected: "#14B882",
  guardian: "#009FA5",
  safe: "#18C6EA",
  verify: "#F5A214",
}

/** Stable — do not recreate inline or the map camera jerks every second. */
const SL_CENTER = { lat: 6.8544, lng: 79.8635 } as const

export function LiveMap() {
  const [filter, setFilter] = useState<MapFilter>("All")
  const [q, setQ] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>("self")
  const [live, setLive] = useState<{ lat: number; lng: number; accuracy: number } | null>(null)
  const [now, setNow] = useState(() => new Date())
  const { coords: watchCoords } = useWatchLive(5000)

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const stats = useMemo(() => getLiveMapNetworkStats(), [])

  const markers = useMemo(() => {
    return filterMapPoints(filter, q).map((p) => {
      const detail = conditionToMarkerDetail(p.condition, p.type)
      return {
        id: p.id,
        lat: p.lat,
        lng: p.lng,
        label: p.label,
        color: markerColors[detail] ?? markerColors.protected,
        detail,
      }
    })
  }, [filter, q])

  const effectiveLive = watchCoords ?? live

  const origin = useMemo(() => {
    if (selectedId && selectedId !== "self") {
      const p = mapPoints.find((x) => x.id === selectedId)
      if (p) return { lat: p.lat, lng: p.lng }
    }
    if (effectiveLive) return { lat: effectiveLive.lat, lng: effectiveLive.lng }
    return SL_CENTER
  }, [selectedId, effectiveLive])

  const nearby = useMemo(() => {
    return mapPoints
      .filter((p) => selectedId === "self" || p.id !== selectedId)
      .map((p) => {
        const detail = conditionToMarkerDetail(p.condition, p.type)
        return {
          id: p.id,
          label: p.label,
          detail,
          distanceKm: haversineKm(origin, { lat: p.lat, lng: p.lng }),
        }
      })
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 5)
  }, [origin, selectedId])

  const focusTarget = useMemo(() => {
    if (!selectedId || selectedId === "self") return null
    const p = mapPoints.find((x) => x.id === selectedId)
    return p ? { lat: p.lat, lng: p.lng } : null
  }, [selectedId])

  const onLiveChange = useCallback(
    (next: { lat: number; lng: number; accuracy: number } | null) => {
      setLive((prev) => {
        if (!next) return null
        if (
          prev &&
          Math.abs(prev.lat - next.lat) < 1e-6 &&
          Math.abs(prev.lng - next.lng) < 1e-6
        ) {
          return prev
        }
        return next
      })
    },
    [],
  )

  const dateLabel = now.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  const timeLabel = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  return (
    <div className="f2s-live-map-page">
      <LiveMapHeader dateLabel={dateLabel} timeLabel={timeLabel} />
      <MapFilterToolbar query={q} onQuery={setQ} filter={filter} onFilter={setFilter} />

      <div className="f2s-lm-main">
        <GoogleLiveMap
          markers={markers}
          className="f2s-lm-map-canvas"
          fallbackCenter={SL_CENTER}
          zoom={14}
          showLiveUser
          consoleMode
          consoleStats={{
            connected: stats.connected,
            total: stats.total,
            attention: stats.attention,
            verify: stats.verify,
            safeZones: stats.safeZones,
          }}
          selectedId={selectedId}
          followLive={Boolean(effectiveLive) && (selectedId === "self" || selectedId == null)}
          focusTarget={focusTarget}
          showSafeZoneCircles={filter === "Safe Zones" || filter === "All"}
          externalLive={watchCoords}
          onLiveChange={onLiveChange}
          onSelectSelf={() => setSelectedId("self")}
          onMarkerClick={(m) => setSelectedId(m.id)}
        />

        <SelectedUserPanel
          selectedId={selectedId}
          liveCoords={effectiveLive ? { lat: effectiveLive.lat, lng: effectiveLive.lng } : null}
          liveAccuracy={effectiveLive?.accuracy ?? null}
          nearby={nearby}
          onSelect={(id) => setSelectedId(id)}
        />
      </div>

      <NetworkSummaryStrip />

      {filter === "Devices" && markers.length === 0 ? (
        <p className="f2s-lm-empty">No connected devices match this view.</p>
      ) : null}
      {(filter === "Guardians" || filter === "Heatmap" || filter === "Routes") && (
        <p className="f2s-lm-empty">
          {filter} view is unavailable until supporting location data is connected.
        </p>
      )}
    </div>
  )
}
