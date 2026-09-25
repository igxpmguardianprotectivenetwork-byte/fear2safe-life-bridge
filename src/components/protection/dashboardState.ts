import { alerts, mapPoints } from "../../data/mock"
import { myDevice, monitoredDevices, protectionDevices } from "../../data/devices"

/** Centralized Protection Centre metrics — derived from existing mock/backend-facing data. */
export function getProtectionDashboardState() {
  const totalUsers = mapPoints.length
  const connectedUsers = monitoredDevices.filter((d) => d.connected).length
  const needAttention = mapPoints.filter(
    (p) => p.condition === "attention" || p.condition === "emergency",
  ).length
  const underVerification = mapPoints.filter((p) => p.condition === "verify").length
  const activeSafeZones = monitoredDevices.filter((d) => d.safeZone).length

  const openAlerts = alerts.filter(
    (a) => a.status === "Needs Verification" || a.status === "Guardian Notified",
  )
  const activeAlert =
    openAlerts.find((a) => a.status === "Guardian Notified") ??
    openAlerts.find((a) => a.status === "Needs Verification") ??
    alerts[0]

  // Response time is not stored per-alert yet — keep a single demo KPI (do not scatter).
  const averageResponseMinutes = 2.4

  return {
    totalUsers,
    connectedUsers,
    needAttention,
    underVerification,
    activeSafeZones,
    averageResponseMinutes,
    myDevice,
    activeAlert,
    alerts,
    mapPoints,
    protectionDevices,
    trends: {
      connected: { pct: 12, up: true },
      attention: { pct: 50, up: false },
      verification: { pct: 0, up: null as boolean | null },
      safeZones: { pct: 33, up: true },
      response: { pct: 40, up: false },
    },
    spark: {
      connected: [3, 4, 4, 5, 5, 5, connectedUsers],
      attention: [4, 3, 2, 3, 2, 1, needAttention],
      verification: [1, 2, 2, 1, 2, 2, underVerification],
      safeZones: [5, 5, 6, 6, 7, 7, activeSafeZones],
      response: [4.1, 3.8, 3.2, 2.9, 2.7, 2.5, averageResponseMinutes],
    },
  }
}

export type ProtectionDashboardState = ReturnType<typeof getProtectionDashboardState>

export function greetingForHour(hour: number) {
  if (hour < 12) return "Good Morning"
  if (hour < 17) return "Good Afternoon"
  return "Good Evening"
}
