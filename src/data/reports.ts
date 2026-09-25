/** Report metrics aligned to the real Fear2Safe demo network (6 devices). */

export const reportSummary = {
  totalAlerts: 9,
  verifiedResolved: 6,
  escalated: 1,
  averageResponseTime: 2.4,
  activeDevices: 6,
  lastUpdated: "12 sec ago",
}

export const reportKpis = [
  {
    id: "alerts",
    label: "Total Alerts",
    value: "9",
    trend: "+2",
    trendUp: true,
    trendPositive: false,
    hint: "this month",
    tone: "pink" as const,
    spark: [3, 4, 5, 5, 7, 6, 8, 9],
  },
  {
    id: "resolved",
    label: "Verified & Resolved",
    value: "6",
    trend: "+1",
    trendUp: true,
    trendPositive: true,
    hint: "this month",
    tone: "green" as const,
    spark: [2, 3, 3, 4, 4, 5, 5, 6],
  },
  {
    id: "escalated",
    label: "Escalated",
    value: "1",
    trend: "0",
    trendUp: false,
    trendPositive: true,
    hint: "this month",
    tone: "orange" as const,
    spark: [2, 2, 1, 1, 1, 1, 1, 1],
  },
  {
    id: "response",
    label: "Avg Response Time",
    value: "2.4",
    unit: "min",
    trend: "-0.6",
    trendUp: false,
    trendPositive: true,
    hint: "vs. last month",
    tone: "blue" as const,
    spark: [4.1, 3.8, 3.4, 3.1, 2.9, 2.7, 2.5, 2.4],
  },
  {
    id: "devices",
    label: "Active Devices",
    value: "6",
    trend: "5+1",
    trendUp: true,
    trendPositive: true,
    hint: "monitored + yours",
    tone: "purple" as const,
    spark: [4, 4, 5, 5, 5, 6, 6, 6],
  },
]

/** Keep shape compatible with existing mock consumers */
export const reportByType = [
  { name: "Unusual Movement", value: 34, count: 3, color: "#F21863" },
  { name: "Manual SOS", value: 22, count: 2, color: "#FF9800" },
  { name: "Check-in Missed", value: 22, count: 2, color: "#28B7E8" },
  { name: "Zone Breach", value: 11, count: 1, color: "#7B52F5" },
  { name: "Device Offline", value: 11, count: 1, color: "#738AA3" },
]

export const reportByTime = [
  { slot: "00–06", count: 1 },
  { slot: "06–12", count: 3 },
  { slot: "12–18", count: 3 },
  { slot: "18–24", count: 2 },
]

export const riskTrend = [
  { day: "Sep 1", alerts: 1, resolved: 1 },
  { day: "Sep 5", alerts: 2, resolved: 1 },
  { day: "Sep 10", alerts: 1, resolved: 1 },
  { day: "Sep 15", alerts: 2, resolved: 2 },
  { day: "Sep 20", alerts: 1, resolved: 1 },
  { day: "Sep 25", alerts: 3, resolved: 0 },
  { day: "Sep 30", alerts: 9, resolved: 6 },
]

export const triggerZones = [
  { rank: 1, name: "Fairline Road, Dehiwala", alerts: 3, pct: 100, trend: "+1", up: true, color: "#F21863" },
  { rank: 2, name: "Kawdana Junction", alerts: 2, pct: 67, trend: "+1", up: true, color: "#159FE8" },
  { rank: 3, name: "Park Avenue, Dehiwala", alerts: 2, pct: 67, trend: "0", up: false, color: "#7B52F5" },
  { rank: 4, name: "Galle Road, Dehiwala", alerts: 1, pct: 33, trend: "0", up: false, color: "#19C6EA" },
  { rank: 5, name: "Hill Street, Dehiwala", alerts: 1, pct: 33, trend: "-1", up: false, color: "#738AA3" },
]

export const deviceHealth = {
  total: 6,
  online: 6,
  offline: 0,
  lowBattery: 1,
}

export const deviceHealthSlices = [
  { name: "Online", value: 6, pct: 83, color: "#16B981" },
  { name: "Low Battery", value: 1, pct: 17, color: "#FF9800" },
]

export const insights = [
  {
    title: "3 active now",
    body: "across 5 monitored people and 6 connected devices.",
    tone: "pink" as const,
    trend: null as string | null,
  },
  {
    title: "Average response",
    body: "guardian acknowledgment in under 2.4 minutes.",
    tone: "blue" as const,
    trend: "↓ 0.6 min",
  },
  {
    title: "6 of 9 resolved",
    body: "after verification without external escalation this month.",
    tone: "green" as const,
    trend: "67%",
  },
]
