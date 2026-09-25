import { alerts, mapPoints, type UserCondition } from "../../data/mock"
import { monitoredDevices, myDevice } from "../../data/devices"

export type MapFilter =
  | "All"
  | "Alerts"
  | "Protected"
  | "Guardians"
  | "Safe Zones"
  | "Heatmap"
  | "Routes"
  | "Devices"

export const MAP_FILTERS: {
  id: MapFilter
  label: string
  enabled: boolean
  reason?: string
}[] = [
  { id: "All", label: "All", enabled: true },
  { id: "Alerts", label: "Alerts", enabled: true },
  { id: "Protected", label: "Protected", enabled: true },
  {
    id: "Guardians",
    label: "Guardians",
    enabled: false,
    reason: "Guardian live locations are not available yet.",
  },
  { id: "Safe Zones", label: "Safe Zones", enabled: true },
  {
    id: "Heatmap",
    label: "Heatmap",
    enabled: false,
    reason: "Available when sufficient incident history is recorded.",
  },
  {
    id: "Routes",
    label: "Routes",
    enabled: false,
    reason: "No active route tracking data is available.",
  },
  { id: "Devices", label: "Devices", enabled: true },
]

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(x))
}

export function deviceForPoint(id: string) {
  if (id === "self" || id === "own" || id === "p6") return myDevice
  const idx = mapPoints.findIndex((p) => p.id === id)
  return idx >= 0 ? monitoredDevices[idx] : null
}

export function getLiveMapNetworkStats() {
  const total = mapPoints.length
  const connected = monitoredDevices.filter((d) => d.connected).length
  const attention = mapPoints.filter(
    (p) => p.condition === "attention" || p.condition === "emergency",
  ).length
  const verify = mapPoints.filter((p) => p.condition === "verify").length
  const safeZones = monitoredDevices.filter((d) => d.safeZone).length
  const activeIncidents = alerts.filter(
    (a) => a.status === "Needs Verification" || a.status === "Guardian Notified",
  ).length

  return {
    total,
    connected,
    attention,
    verify,
    safeZones,
    activeIncidents,
    activeRoutes: 0,
  }
}

export function filterMapPoints(filter: MapFilter, query: string) {
  const q = query.trim().toLowerCase()
  return mapPoints.filter((p) => {
    const device = deviceForPoint(p.id)
    const hay = [
      p.label,
      p.nodeId,
      p.condition,
      p.type,
      device?.name,
      device?.serial,
      device?.location,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
    if (q && !hay.includes(q)) return false

    switch (filter) {
      case "Alerts":
        return (
          p.condition === "emergency" ||
          p.condition === "attention" ||
          p.type === "alert"
        )
      case "Protected":
        return p.condition === "safe" || p.type === "protected" || p.type === "safe"
      case "Safe Zones":
        return Boolean(device?.safeZone)
      case "Devices":
        return Boolean(device?.connected)
      case "Guardians":
      case "Heatmap":
      case "Routes":
        return false
      case "All":
      default:
        return true
    }
  })
}

export function conditionToMarkerDetail(c: UserCondition, type: string) {
  if (c === "emergency") return "alert"
  if (c === "attention") return "attention"
  if (c === "verify") return "verify"
  if (type === "safe") return "safe"
  return "protected"
}

export function statusLabel(detail?: string) {
  switch (detail) {
    case "alert":
      return "ALERT"
    case "attention":
      return "ATTENTION"
    case "verify":
      return "VERIFY"
    case "safe":
      return "SAFE"
    case "guardian":
      return "GUARDIAN"
    default:
      return "ONLINE"
  }
}
