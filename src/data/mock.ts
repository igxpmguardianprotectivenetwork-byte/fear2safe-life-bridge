export type AlertSeverity = "high" | "medium" | "low"

export type AlertItem = {
  id: string
  title: string
  person: string
  location: string
  time: string
  severity: AlertSeverity
  source: string
  reason: string
  status: string
  lat: number
  lng: number
}

export const alerts: AlertItem[] = [
  {
    id: "risk-detected",
    title: "Risk Detected",
    person: "Student, 15 years",
    location: "MG Road Bus Stop, Bengaluru",
    time: "2 min ago",
    severity: "high",
    source: "Wearable Bracelet",
    reason: "Stress + Unusual Movement",
    status: "Needs Verification",
    lat: 12.9758,
    lng: 77.6063,
  },
  {
    id: "manual-sos",
    title: "Manual SOS",
    person: "Ananya Reddy",
    location: "Indiranagar Metro Exit",
    time: "18 min ago",
    severity: "medium",
    source: "Wearable Band · SOS Button",
    reason: "User pressed SOS",
    status: "Guardian Notified",
    lat: 12.9784,
    lng: 77.6408,
  },
  {
    id: "check-in-missed",
    title: "Check-in Missed",
    person: "Meera Iyer",
    location: "School Gate · Koramangala",
    time: "45 min ago",
    severity: "low",
    source: "Schedule · Auto Check-in",
    reason: "Expected school arrival check-in not received",
    status: "Monitoring",
    lat: 12.9352,
    lng: 77.6245,
  },
]

export const guardians = [
  {
    id: "g1",
    name: "M. S. Farook",
    relation: "Father · Primary Guardian",
    phone: "+91 98765 43210",
    role: "Primary" as const,
    status: "Active" as const,
    avatar: "MF",
    color: "#E91E63",
  },
  {
    id: "g2",
    name: "Fathima Begum",
    relation: "Mother · Secondary Guardian",
    phone: "+91 98123 45678",
    role: "Secondary" as const,
    status: "Active" as const,
    avatar: "FB",
    color: "#29B6F6",
  },
]

export const emergencyContacts = [
  { id: "e1", name: "Lakshmi Devi", relation: "Aunt", phone: "+91 99001 11223", avatar: "LD" },
  { id: "e2", name: "Ms. Kavitha", relation: "School Contact", phone: "+91 98450 77889", avatar: "MK" },
  { id: "e3", name: "Arjun Patel", relation: "Neighbour", phone: "+91 97222 33445", avatar: "AP" },
]

export const mapPoints = [
  { id: "p1", label: "Priya", type: "alert" as const, lat: 6.9271, lng: 79.8612 },
  { id: "p2", label: "Ananya", type: "alert" as const, lat: 6.9147, lng: 79.873 },
  { id: "p3", label: "Meera", type: "protected" as const, lat: 6.902, lng: 79.8605 },
  { id: "p4", label: "Farook", type: "guardian" as const, lat: 6.9344, lng: 79.8428 },
  { id: "p5", label: "Fathima", type: "guardian" as const, lat: 6.915, lng: 79.89 },
  { id: "p6", label: "Home Safe Zone", type: "safe" as const, lat: 6.9012, lng: 79.852 },
  { id: "p7", label: "School Zone", type: "safe" as const, lat: 6.9105, lng: 79.868 },
  { id: "p8", label: "Under Verify", type: "verify" as const, lat: 6.936, lng: 79.875 },
]

export const reportByType = [
  { name: "Unusual Movement", value: 38, color: "#E91E63" },
  { name: "Manual SOS", value: 22, color: "#F59E0B" },
  { name: "Check-in Missed", value: 18, color: "#4FC3F7" },
  { name: "Zone Breach", value: 14, color: "#8B5CF6" },
  { name: "Device Offline", value: 8, color: "#6B7C8F" },
]

export const reportByTime = [
  { slot: "00–06", count: 6 },
  { slot: "06–12", count: 28 },
  { slot: "12–18", count: 41 },
  { slot: "18–24", count: 33 },
]

export const insights = [
  { title: "61% of alerts", body: "occurred in public transport corridors this month." },
  { title: "Average response", body: "guardian acknowledgment in under 2.4 minutes." },
  { title: "92% resolved", body: "without external escalation after verification." },
]

export function getAlert(id: string) {
  return alerts.find((a) => a.id === id) ?? alerts[0]
}
