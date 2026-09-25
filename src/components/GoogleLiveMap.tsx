import { useCallback, useEffect, useMemo, useState } from "react"
import { GoogleMap, MarkerF, CircleF, useJsApiLoader } from "@react-google-maps/api"
import { MapPin, Navigation, Radio } from "lucide-react"

export type LiveMapMarker = {
  id: string
  lat: number
  lng: number
  label: string
  color: string
  detail?: string
}

type GoogleLiveMapProps = {
  markers?: LiveMapMarker[]
  className?: string
  /** Default center when GPS is unavailable */
  fallbackCenter?: { lat: number; lng: number }
  zoom?: number
  showLiveUser?: boolean
}

const mapContainerStyle = { width: "100%", height: "100%" }

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#fff5f8" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a6b78" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e5a0b4" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#fce4ec" }] },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#e5a0b4" }],
  },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#fff8fb" }] },
]

export function GoogleLiveMap({
  markers = [],
  className = "h-[340px]",
  fallbackCenter = { lat: 7.8731, lng: 80.7718 },
  zoom = 13,
  showLiveUser = true,
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
    if (!showLiveUser || !navigator.geolocation) {
      setLiveError("Geolocation not available")
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setLive({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy || 40,
        })
        setUpdatedAt(new Date())
        setLiveError(null)
      },
      (err) => {
        setLiveError(err.message || "Location permission needed")
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [showLiveUser])

  const center = live ?? (markers[0] ? { lat: markers[0].lat, lng: markers[0].lng } : fallbackCenter)

  useEffect(() => {
    if (!map) return
    if (live) {
      map.panTo(live)
      return
    }
    if (markers.length > 1) {
      const bounds = new google.maps.LatLngBounds()
      markers.forEach((m) => bounds.extend({ lat: m.lat, lng: m.lng }))
      map.fitBounds(bounds, 48)
    }
  }, [map, live, markers])

  const onLoad = useCallback((m: google.maps.Map) => setMap(m), [])

  const options = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      clickableIcons: false,
      styles: MAP_STYLES,
      gestureHandling: "greedy",
    }),
    [],
  )

  if (loadError) {
    return (
      <div className={`flex items-center justify-center rounded-[14px] border border-pink/30 bg-pink-soft text-sm text-pink ${className}`}>
        Google Maps failed to load. Check API key & Maps JavaScript API.
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center rounded-[14px] border border-[#e5a0b4] bg-[#fff8fb] text-sm text-[#8a6b78] ${className}`}>
        Loading live map…
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-[14px] border border-[#e5a0b4] ${className}`}>
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
            title={`${m.label}${m.detail ? ` · ${m.detail}` : ""}`}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 9,
              fillColor: m.color,
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }}
          />
        ))}

        {live && (
          <>
            <MarkerF
              position={live}
              title="Your live location"
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#E91E63",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 3,
              }}
            />
            <CircleF
              center={live}
              radius={Math.max(live.accuracy, 25)}
              options={{
                fillColor: "#E91E63",
                fillOpacity: 0.12,
                strokeColor: "#E91E63",
                strokeOpacity: 0.45,
                strokeWeight: 1.5,
              }}
            />
          </>
        )}
      </GoogleMap>

      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/95 px-2.5 py-1 text-[11px] font-bold text-navy shadow-sm backdrop-blur">
          <span className={`h-2 w-2 rounded-full ${live ? "animate-pulse bg-mint" : "bg-orange"}`} />
          {live ? "LIVE GPS" : "WAITING GPS"}
        </span>
        {live && (
          <span className="inline-flex items-center gap-1 rounded-full border border-white/80 bg-white/95 px-2.5 py-1 text-[11px] font-medium text-muted shadow-sm backdrop-blur">
            <Navigation className="h-3 w-3 text-pink" />
            {live.lat.toFixed(5)}, {live.lng.toFixed(5)}
          </span>
        )}
      </div>

      <div className="absolute right-3 bottom-3 z-10 max-w-[220px] rounded-xl border border-white/80 bg-white/95 px-3 py-2 text-[11px] shadow-sm backdrop-blur">
        {live ? (
          <p className="flex items-start gap-1.5 font-medium text-navy">
            <Radio className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint" />
            Live location updating
            {updatedAt ? ` · ${updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}` : ""}
          </p>
        ) : (
          <p className="flex items-start gap-1.5 font-medium text-muted">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-pink" />
            {liveError || "Allow location access for live tracking"}
          </p>
        )}
      </div>
    </div>
  )
}
