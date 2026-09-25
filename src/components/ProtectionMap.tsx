import { useEffect, useMemo } from "react"
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet"
import type { LatLngExpression } from "leaflet"

export type MapMarker = {
  id: string
  lat: number
  lng: number
  label: string
  color: string
  detail?: string
}

function FitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap()
  useEffect(() => {
    if (!markers.length) return
    const lats = markers.map((m) => m.lat)
    const lngs = markers.map((m) => m.lng)
    map.fitBounds(
      [
        [Math.min(...lats) - 0.01, Math.min(...lngs) - 0.01],
        [Math.max(...lats) + 0.01, Math.max(...lngs) + 0.01],
      ],
      { padding: [28, 28], maxZoom: 14 },
    )
  }, [map, markers])
  return null
}

export function ProtectionMap({
  markers,
  className = "h-[320px]",
  zoom = 13,
  center,
  pulseId,
}: {
  markers: MapMarker[]
  className?: string
  zoom?: number
  center?: LatLngExpression
  pulseId?: string
}) {
  const mid = useMemo<LatLngExpression>(() => {
    if (center) return center
    if (!markers.length) return [12.9716, 77.5946]
    const lat = markers.reduce((s, m) => s + m.lat, 0) / markers.length
    const lng = markers.reduce((s, m) => s + m.lng, 0) / markers.length
    return [lat, lng]
  }, [center, markers])

  return (
    <div className={`overflow-hidden rounded-[14px] border border-border ${className}`}>
      <MapContainer center={mid} zoom={zoom} scrollWheelZoom={false} className="h-full w-full" attributionControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <FitBounds markers={markers} />
        {markers.map((m) => (
          <CircleMarker
            key={m.id}
            center={[m.lat, m.lng]}
            radius={pulseId === m.id ? 12 : 9}
            pathOptions={{
              color: "#fff",
              weight: 2,
              fillColor: m.color,
              fillOpacity: 0.95,
            }}
          >
            <Popup>
              <div className="text-xs">
                <p className="font-bold text-navy">{m.label}</p>
                {m.detail ? <p className="text-muted">{m.detail}</p> : null}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
