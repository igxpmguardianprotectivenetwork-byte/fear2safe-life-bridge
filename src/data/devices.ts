import { mapPoints } from "./mock"

export type ProtectionDevice = {
  id: number
  label: string
  name: string
  wearer: string
  serial: string
  connected: boolean
  /** AP10 alarm 03 = off wrist; AP49 heart rate 30–220 = on wrist. */
  onWrist?: boolean | null
  gpsFix?: boolean
  connectionType: string
  lastSync: string
  signalStrength: "Strong" | "Fair" | "Weak"
  battery: number
  estimatedBatteryHours: number
  location: string
  safeZone: boolean
  gpsAccuracy: "High" | "Medium" | "Low"
  protectionState: "Protected" | "Attention"
  monitoringActive: boolean
  guardiansConnected: number
  /** Core biometrics */
  heartRate: number
  spo2: number
  skinTemperature: number
  hrv: number
  respiratoryRate: number
  edaSupported: boolean
  eda: number | null
  /** Activity */
  activity: string
  activityNote: string
  /** Movement / body-state */
  accelerometerG: number
  activityLevel: "Low" | "Moderate" | "High"
  fallDetected: boolean
  impactDetected: boolean
  suddenMovement: boolean
  prolongedImmobility: boolean
  immobilityMinutes: number
  locomotion: "Still" | "Walking" | "Running"
  postureChange: boolean
  postureLabel: string
  strugglePattern: boolean
  /** Derived physiological indicators */
  stressIndex: number
  restingHr: number
  hrTrend: "Rising" | "Stable" | "Falling"
  hrvTrend: "Rising" | "Stable" | "Falling"
  tempDeviation: number
  spo2Deviation: number
  spo2Trend: "Rising" | "Stable" | "Falling"
  abnormalPulse: boolean
  elevatedHrEvent: boolean
  anomalyScore: number
  baselineDeviationScore: number
  /** Operator own band — position comes from Live GPS, not a map pin */
  isOwnDevice?: boolean
}

const batteries = [78, 92, 64, 41, 85]
const hours = [18, 22, 14, 8, 20]
const syncs = [
  "12 seconds ago",
  "8 seconds ago",
  "34 seconds ago",
  "1 min ago",
  "5 seconds ago",
]
const places = [
  "Kawdana Junction · Dehiwala",
  "Hill Street · Dehiwala",
  "Galle Road · Dehiwala",
  "Fairline Road · Dehiwala",
  "Park Avenue · Dehiwala",
]
const hearts = [87, 74, 91, 82, 79]
const spo2s = [98, 97, 99, 96, 98]
const temps = [36.7, 36.5, 36.9, 36.6, 36.8]
const hrvs = [42, 58, 36, 48, 51]
const resps = [16, 14, 18, 15, 15]
const edas = [2.4, null, 3.1, null, 1.8] as (number | null)[]
const stress = [38, 22, 54, 31, 28]
const resting = [64, 61, 68, 63, 62]
const hrTrends = ["Rising", "Stable", "Rising", "Stable", "Falling"] as const
const hrvTrends = ["Falling", "Rising", "Falling", "Stable", "Stable"] as const
const tempDev = [0.2, -0.1, 0.4, 0.0, 0.1]
const spo2Dev = [-1, 0, 1, -2, 0]
const spo2Trends = ["Stable", "Stable", "Rising", "Falling", "Stable"] as const
const abnormal = [false, false, true, false, false]
const elevated = [false, false, true, false, false]
const anomaly = [18, 9, 46, 22, 14]
const baseline = [12, 7, 38, 16, 11]
const activities = [
  { label: "Normal", note: "Light movement", level: "Moderate" as const, loco: "Walking" as const, posture: "Upright" },
  { label: "Walking", note: "Moderate pace", level: "Moderate" as const, loco: "Walking" as const, posture: "Upright" },
  { label: "Resting", note: "Low movement", level: "Low" as const, loco: "Still" as const, posture: "Seated" },
  { label: "Active", note: "Elevated motion", level: "High" as const, loco: "Running" as const, posture: "Upright" },
  { label: "Normal", note: "Light movement", level: "Moderate" as const, loco: "Walking" as const, posture: "Upright" },
]
const accel = [0.42, 0.68, 0.18, 1.15, 0.51]
const fallFlags = [false, false, false, false, false]
const impactFlags = [false, false, true, false, false]
const suddenFlags = [false, false, true, true, false]
const immobileFlags = [false, false, false, false, false]
const immobileMins = [0, 0, 2, 0, 0]
const postureChange = [true, true, false, true, false]
const struggleFlags = [false, false, true, false, false]
const guardians = [2, 2, 1, 2, 3]
const safeZones = [true, true, false, true, true]

function buildDevice(
  u: (typeof mapPoints)[number],
  i: number,
): ProtectionDevice {
  return {
    id: i + 1,
    label: `Device ${i + 1}`,
    name: "Fear2Safe Health Band",
    wearer: u.label,
    serial: `FS-LifeBridge-0${i + 1}`,
    connected: true,
    connectionType: "Bluetooth + LTE",
    lastSync: syncs[i],
    signalStrength: batteries[i] > 50 ? "Strong" : "Fair",
    battery: batteries[i],
    estimatedBatteryHours: hours[i],
    location: places[i],
    safeZone: safeZones[i],
    gpsAccuracy: "High",
    protectionState: "Protected",
    monitoringActive: true,
    guardiansConnected: guardians[i],
    heartRate: hearts[i],
    spo2: spo2s[i],
    skinTemperature: temps[i],
    hrv: hrvs[i],
    respiratoryRate: resps[i],
    edaSupported: edas[i] != null,
    eda: edas[i],
    activity: activities[i].label,
    activityNote: activities[i].note,
    accelerometerG: accel[i],
    activityLevel: activities[i].level,
    fallDetected: fallFlags[i],
    impactDetected: impactFlags[i],
    suddenMovement: suddenFlags[i],
    prolongedImmobility: immobileFlags[i],
    immobilityMinutes: immobileMins[i],
    locomotion: activities[i].loco,
    postureChange: postureChange[i],
    postureLabel: activities[i].posture,
    strugglePattern: struggleFlags[i],
    stressIndex: stress[i],
    restingHr: resting[i],
    hrTrend: hrTrends[i],
    hrvTrend: hrvTrends[i],
    tempDeviation: tempDev[i],
    spo2Deviation: spo2Dev[i],
    spo2Trend: spo2Trends[i],
    abnormalPulse: abnormal[i],
    elevatedHrEvent: elevated[i],
    anomalyScore: anomaly[i],
    baselineDeviationScore: baseline[i],
  }
}

/** Monitored people only — never includes the operator live-GPS pin. */
export const monitoredDevices: ProtectionDevice[] = mapPoints.map(buildDevice)

/** Operator band. Position is the Live GPS marker on maps — not a fixed map pin. */
export const myDevice: ProtectionDevice = {
  id: 6,
  label: "My Device",
  name: "Fear2Safe Health Band",
  wearer: "You",
  serial: "FS-LifeBridge-OWN",
  connected: true,
  connectionType: "Bluetooth + LTE",
  lastSync: "Just now",
  signalStrength: "Strong",
  battery: 96,
  estimatedBatteryHours: 24,
  location: "Live GPS · Current Location",
  safeZone: true,
  gpsAccuracy: "High",
  protectionState: "Protected",
  monitoringActive: true,
  guardiansConnected: 2,
  heartRate: 72,
  spo2: 99,
  skinTemperature: 36.6,
  hrv: 62,
  respiratoryRate: 14,
  edaSupported: true,
  eda: 1.6,
  activity: "Normal",
  activityNote: "At home area",
  accelerometerG: 0.22,
  activityLevel: "Low",
  fallDetected: false,
  impactDetected: false,
  suddenMovement: false,
  prolongedImmobility: false,
  immobilityMinutes: 0,
  locomotion: "Still",
  postureChange: false,
  postureLabel: "Seated",
  strugglePattern: false,
  stressIndex: 18,
  restingHr: 58,
  hrTrend: "Stable",
  hrvTrend: "Rising",
  tempDeviation: -0.05,
  spo2Deviation: 1,
  spo2Trend: "Stable",
  abnormalPulse: false,
  elevatedHrEvent: false,
  anomalyScore: 8,
  baselineDeviationScore: 5,
  isOwnDevice: true,
}

export const protectionDevices: ProtectionDevice[] = [...monitoredDevices, myDevice]

export function isOwnDeviceId(id: string | null | undefined) {
  return id === "self" || id === "own" || id === "p6" || id === "USR-OWN"
}
