import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { GoogleLiveMap } from "../components/GoogleLiveMap"
import { LiveVitalsView } from "../components/LiveVitalsView"
import {
  LiveProtectionSection,
  NetworkOverview,
  OperationalRow,
  ProtectionHeader,
} from "../components/protection/ProtectionCentre"
import {
  getProtectionDashboardState,
  greetingForHour,
} from "../components/protection/dashboardState"
import { mapPoints } from "../data/mock"

const markerColors = {
  alert: "#C62828",
  protected: "#15803D",
  guardian: "#2563EB",
  safe: "#15803D",
  verify: "#2563EB",
}

const layers = ["Overview", "Live Vitals"] as const

export function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const userFromUrl = searchParams.get("user")
  const tabFromUrl = searchParams.get("tab")

  const [layer, setLayer] = useState<(typeof layers)[number]>(
    tabFromUrl === "vitals" || userFromUrl ? "Live Vitals" : "Overview",
  )
  const [vitalsUserId, setVitalsUserId] = useState<string | null>(userFromUrl)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const user = searchParams.get("user")
    const tab = searchParams.get("tab")
    if (user || tab === "vitals") {
      setLayer("Live Vitals")
      if (user) setVitalsUserId(user)
    }
  }, [searchParams])

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const state = useMemo(() => getProtectionDashboardState(), [])

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const date = now.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })
  const greeting = greetingForHour(now.getHours())

  const markers = mapPoints.map((p) => ({
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    label: p.label,
    color: markerColors[p.type],
    detail: p.type,
  }))

  const openUserVitals = (userId: string) => {
    setVitalsUserId(userId)
    setLayer("Live Vitals")
    setSearchParams({ tab: "vitals", user: userId })
  }

  const switchLayer = (tab: (typeof layers)[number]) => {
    setLayer(tab)
    if (tab === "Overview") {
      setSearchParams({})
      setVitalsUserId(null)
    } else {
      setSearchParams(vitalsUserId ? { tab: "vitals", user: vitalsUserId } : { tab: "vitals" })
    }
  }

  return (
    <div className="f2s-pc-page">
      <ProtectionHeader
        greeting={greeting}
        dateLabel={date}
        timeLabel={time}
        layer={layer}
        onLayerChange={switchLayer}
      />

      {layer === "Overview" && (
        <div className="f2s-pc-overview-stack">
          <LiveProtectionSection
            state={state}
            map={
              <GoogleLiveMap
                markers={markers}
                className="f2s-pc-map-canvas border-0"
                fallbackCenter={{ lat: 6.8544, lng: 79.8635 }}
                zoom={14}
                showLiveUser
                hideFloatingStats
                onMarkerClick={(m) => openUserVitals(m.id)}
              />
            }
          />
          <NetworkOverview state={state} />
          <OperationalRow state={state} />
        </div>
      )}

      {layer === "Live Vitals" && (
        <LiveVitalsView
          initialUserId={vitalsUserId}
          onUserChange={(id) => {
            setVitalsUserId(id)
            if (id) setSearchParams({ tab: "vitals", user: id })
            else setSearchParams({ tab: "vitals" })
          }}
        />
      )}
    </div>
  )
}
