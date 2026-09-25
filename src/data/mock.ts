export type AlertSeverity = "high" | "medium" | "low" | "emergency"

export type AlertWorkflowState =
  | "DETECTED"
  | "VERIFYING"
  | "GUARDIAN_RESPONSE"
  | "ESCALATED"
  | "RESOLVED"

export type AlertItem = {
  id: string
  title: string
  person: string
  userId?: string
  nodeId?: string
  location: string
  time: string
  severity: AlertSeverity
  source: string
  reason: string
  status: string
  workflow: AlertWorkflowState
  alertType: string
  lat: number
  lng: number
  sos?: boolean
  outsideSafeZone?: boolean
  detectedAtLabel?: string
  activeMinutes?: number
  battery?: number
  deviceName?: string
  firmware?: string
}

export const alerts: AlertItem[] = [
  {
    id: "manual-sos",
    title: "Manual SOS",
    person: "Priya",
    userId: "p1",
    nodeId: "USR-0P1",
    location: "Kawdana Junction · Dehiwala, Western Province, Sri Lanka",
    time: "1 min ago",
    severity: "emergency",
    source: "Wearable Band · SOS Button",
    reason: "User pressed SOS · Immediate response required",
    status: "Guardian Notified",
    workflow: "GUARDIAN_RESPONSE",
    alertType: "Manual SOS",
    lat: 6.8541,
    lng: 79.8668,
    sos: true,
    outsideSafeZone: true,
    detectedAtLabel: "Sep 25, 2026 · 05:00 AM",
    activeMinutes: 1,
    battery: 78,
    deviceName: "Fear2Safe Health Band",
    firmware: "FW-1.2.0",
  },
  {
    id: "risk-detected",
    title: "Risk Detected",
    person: "Nuwan",
    userId: "p4",
    nodeId: "USR-0P4",
    location: "Fairline Road · Dehiwala, Western Province, Sri Lanka",
    time: "12 min ago",
    severity: "high",
    source: "Wearable Bracelet",
    reason: "Sudden impact detected · Unusual motion pattern · No response",
    status: "Needs Verification",
    workflow: "VERIFYING",
    alertType: "Sudden Impact Detection",
    lat: 6.8516,
    lng: 79.8665,
    sos: false,
    outsideSafeZone: true,
    detectedAtLabel: "Sep 25, 2026 · 04:31 AM",
    activeMinutes: 12,
    battery: 41,
    deviceName: "Fear2Safe Health Band",
    firmware: "FW-1.2.0",
  },
  {
    id: "check-in-missed",
    title: "Attention Required",
    person: "Sanduni",
    userId: "p5",
    nodeId: "USR-0P5",
    location: "Park Avenue · Dehiwala, Western Province, Sri Lanka",
    time: "7 min ago",
    severity: "medium",
    source: "Wearable · Motion + Vitals",
    reason: "Elevated heart rate · Unusual movement pattern",
    status: "Monitoring",
    workflow: "DETECTED",
    alertType: "Attention Pattern",
    lat: 6.8522,
    lng: 79.867,
    sos: false,
    outsideSafeZone: false,
    detectedAtLabel: "Sep 25, 2026 · 04:54 AM",
    activeMinutes: 7,
    battery: 85,
    deviceName: "Fear2Safe Health Band",
    firmware: "FW-1.2.0",
  },
]
export const guardians = [
  {
    id: "g1",
    name: "M. S. Perera",
    relation: "Father · Primary Guardian",
    phone: "+94 77 123 4567",
    role: "Primary" as const,
    status: "Active" as const,
    avatar: "MP",
    color: "#E91E63",
    verified: true,
    preferredContact: "Phone Call" as const,
    lastResponse: "2 min ago",
    availability: "Online" as const,
    typicalResponseMinutes: 5,
  },
  {
    id: "g2",
    name: "Nimali Silva",
    relation: "Mother · Secondary Guardian",
    phone: "+94 71 234 5678",
    role: "Secondary" as const,
    status: "Active" as const,
    avatar: "NS",
    color: "#29B6F6",
    verified: true,
    preferredContact: "Phone Call" as const,
    lastResponse: "12 min ago",
    availability: "Online" as const,
    typicalResponseMinutes: 15,
  },
  {
    id: "g3",
    name: "Lakshmi Devi",
    relation: "Aunt · Secondary Guardian",
    phone: "+94 76 345 6789",
    role: "Secondary" as const,
    status: "Active" as const,
    avatar: "LD",
    color: "#7B52F5",
    verified: true,
    preferredContact: "SMS" as const,
    lastResponse: "8 min ago",
    availability: "Online" as const,
    typicalResponseMinutes: 10,
  },
  {
    id: "g4",
    name: "Ms. Kavitha",
    relation: "School Contact · Primary Guardian",
    phone: "+94 77 456 7890",
    role: "Primary" as const,
    status: "Active" as const,
    avatar: "MK",
    color: "#009FA5",
    verified: true,
    preferredContact: "Phone Call" as const,
    lastResponse: "5 min ago",
    availability: "Online" as const,
    typicalResponseMinutes: 8,
  },
  {
    id: "g5",
    name: "Arjun Patel",
    relation: "Neighbour · Secondary Guardian",
    phone: "+94 70 567 8901",
    role: "Secondary" as const,
    status: "Active" as const,
    avatar: "AP",
    color: "#F5A214",
    verified: true,
    preferredContact: "Phone Call" as const,
    lastResponse: "20 min ago",
    availability: "Away" as const,
    typicalResponseMinutes: 18,
  },
  {
    id: "g6",
    name: "Dr. Fernando",
    relation: "Family Doctor · Secondary Guardian",
    phone: "+94 11 234 5678",
    role: "Secondary" as const,
    status: "Active" as const,
    avatar: "DF",
    color: "#3478F6",
    verified: true,
    preferredContact: "Phone Call" as const,
    lastResponse: "1 hr ago",
    availability: "Online" as const,
    typicalResponseMinutes: 25,
  },
  {
    id: "g7",
    name: "Saman Jayasuriya",
    relation: "Uncle · Primary Guardian",
    phone: "+94 77 888 1122",
    role: "Primary" as const,
    status: "Active" as const,
    avatar: "SJ",
    color: "#F2385A",
    verified: true,
    preferredContact: "Phone Call" as const,
    lastResponse: "4 min ago",
    availability: "Online" as const,
    typicalResponseMinutes: 6,
  },
  {
    id: "g8",
    name: "Chamari Perera",
    relation: "Sister · Secondary Guardian",
    phone: "+94 71 999 3344",
    role: "Secondary" as const,
    status: "Active" as const,
    avatar: "CP",
    color: "#14B882",
    verified: true,
    preferredContact: "App Message" as const,
    lastResponse: "15 min ago",
    availability: "Online" as const,
    typicalResponseMinutes: 12,
  },
  {
    id: "g9",
    name: "Ruwan Wickramasinghe",
    relation: "Coach · Secondary Guardian",
    phone: "+94 76 555 7788",
    role: "Secondary" as const,
    status: "Active" as const,
    avatar: "RW",
    color: "#149FE8",
    verified: false,
    preferredContact: "Phone Call" as const,
    lastResponse: "45 min ago",
    availability: "Away" as const,
    typicalResponseMinutes: 20,
  },
  {
    id: "g10",
    name: "Thilini Gunasekara",
    relation: "Mother · Primary Guardian",
    phone: "+94 77 222 5566",
    role: "Primary" as const,
    status: "Active" as const,
    avatar: "TG",
    color: "#E91E63",
    verified: true,
    preferredContact: "Phone Call" as const,
    lastResponse: "1 min ago",
    availability: "Online" as const,
    typicalResponseMinutes: 4,
  },
]

/** Guardian IDs assigned to each monitored user (p1–p5). */
export const guardiansByUserId: Record<string, string[]> = {
  p1: ["g1", "g2", "g3"],
  p2: ["g4", "g5", "g6"],
  p3: ["g7", "g8"],
  p4: ["g1", "g8", "g6"],
  p5: ["g10", "g9", "g5"],
}

export function getGuardiansForUser(userId: string) {
  const ids = guardiansByUserId[userId] ?? []
  return ids
    .map((id) => guardians.find((g) => g.id === id))
    .filter((g): g is (typeof guardians)[number] => Boolean(g))
}

export const emergencyContacts = [
  {
    id: "e1",
    name: "Lakshmi Devi",
    relation: "Aunt",
    phone: "+94 76 345 6789",
    avatar: "LD",
    category: "Family" as const,
  },
  {
    id: "e2",
    name: "Ms. Kavitha",
    relation: "School Contact",
    phone: "+94 77 456 7890",
    avatar: "MK",
    category: "School" as const,
  },
  {
    id: "e3",
    name: "Arjun Patel",
    relation: "Neighbour",
    phone: "+94 70 567 8901",
    avatar: "AP",
    category: "Neighbour" as const,
  },
]

export type UserCondition = "safe" | "verify" | "attention" | "emergency"

export const conditionMeta: Record<
  UserCondition,
  { label: string; color: string; soft: string }
> = {
  safe: { label: "Safe", color: "#15803D", soft: "#DCFCE7" },
  verify: { label: "Verification", color: "#2563EB", soft: "#DBEAFE" },
  attention: { label: "Attention", color: "#B45309", soft: "#FEF3C7" },
  emergency: { label: "Emergency / SOS", color: "#C62828", soft: "#FEE2E2" },
}

export const mapPoints = [
  {
    id: "p1",
    label: "Priya",
    type: "alert" as const,
    condition: "emergency" as UserCondition,
    lat: 6.8541,
    lng: 79.8668,
    nodeId: "USR-0P1",
  },
  {
    id: "p2",
    label: "Meera",
    type: "protected" as const,
    condition: "safe" as UserCondition,
    lat: 6.8536,
    lng: 79.8661,
    nodeId: "USR-0P2",
  },
  {
    id: "p3",
    label: "Ananya",
    type: "safe" as const,
    condition: "safe" as UserCondition,
    lat: 6.8518,
    lng: 79.8642,
    nodeId: "USR-0P3",
  },
  {
    id: "p4",
    label: "Nuwan",
    type: "verify" as const,
    condition: "verify" as UserCondition,
    lat: 6.8516,
    lng: 79.8665,
    nodeId: "USR-0P4",
  },
  {
    id: "p5",
    label: "Sanduni",
    type: "alert" as const,
    condition: "attention" as UserCondition,
    lat: 6.8522,
    lng: 79.8670,
    nodeId: "USR-0P5",
  },
]

export { reportByType, reportByTime, insights } from "./reports"

export function getAlert(id: string) {
  return alerts.find((a) => a.id === id) ?? alerts[0]
}

export function getActiveIncidents() {
  return alerts
    .filter((a) => a.workflow !== "RESOLVED")
    .slice()
    .sort((a, b) => {
      const rank = (x: AlertItem) => {
        if (x.sos || x.severity === "emergency") return 0
        if (x.severity === "high") return 1
        if (x.workflow === "VERIFYING") return 2
        if (x.severity === "medium") return 3
        return 4
      }
      const d = rank(a) - rank(b)
      if (d !== 0) return d
      return (a.activeMinutes ?? 0) - (b.activeMinutes ?? 0)
    })
}
