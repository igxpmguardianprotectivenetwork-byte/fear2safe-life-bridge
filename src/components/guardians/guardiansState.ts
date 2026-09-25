import { emergencyContacts, getGuardiansForUser, guardians, mapPoints } from "../../data/mock"

export type GuardianRecord = (typeof guardians)[number]
export type EmergencyContactRecord = (typeof emergencyContacts)[number]

/** Derive readiness from available operational fields — not an AI score. */
export function deriveReadiness(g: GuardianRecord) {
  let score = 40
  if (g.status === "Active") score += 28
  if (g.verified) score += 14
  if (g.availability === "Online") score += 10
  if (g.role === "Primary") score += 3
  if (g.typicalResponseMinutes <= 5) score += 5
  else if (g.typicalResponseMinutes <= 15) score += 2
  score = Math.min(99, Math.max(0, score))

  const level =
    score >= 90 ? ("High" as const) : score >= 75 ? ("Good" as const) : ("Fair" as const)

  return {
    score,
    level,
    label: `${level} Response Readiness`,
    hint: `Usually responds within ${g.typicalResponseMinutes} minutes`,
  }
}

/** Transparent network health from configured coverage — not a predictive model. */
export function deriveNetworkHealth(userId?: string) {
  const list = userId ? getGuardiansForUser(userId) : guardians
  const totalGuardians = list.length
  const activeGuardians = list.filter((g) => g.status === "Active").length
  const verifiedGuardians = list.filter((g) => g.verified).length
  const contacts = emergencyContacts.length
  const escalationReady = totalGuardians >= 2 && contacts >= 1

  let points = 0
  let max = 0
  max += 40
  points += totalGuardians ? (activeGuardians / totalGuardians) * 40 : 0
  max += 25
  points += totalGuardians ? (verifiedGuardians / totalGuardians) * 25 : 0
  max += 20
  points += Math.min(contacts, 3) * (20 / 3)
  max += 15
  points += escalationReady ? 15 : 0

  const pct = Math.round((points / max) * 100)

  return {
    pct,
    activeGuardians,
    totalGuardians,
    verifiedGuardians,
    contacts,
    escalationReady,
    allVerified: verifiedGuardians === totalGuardians && totalGuardians > 0,
    allActive: activeGuardians === totalGuardians && totalGuardians > 0,
  }
}

export function getGuardiansNetworkStats(userId?: string) {
  const list = userId ? getGuardiansForUser(userId) : guardians
  const totalGuardians = list.length
  const activeNow = list.filter((g) => g.status === "Active").length
  const contacts = emergencyContacts.length
  const verifiedProfiles = list.filter((g) => g.verified).length + contacts
  const avgResponse =
    list.reduce((s, g) => s + g.typicalResponseMinutes, 0) / Math.max(list.length, 1)

  return {
    totalGuardians,
    activeNow,
    contacts,
    verifiedProfiles,
    avgResponseMinutes: Math.round(avgResponse),
    activePct: totalGuardians ? Math.round((activeNow / totalGuardians) * 100) : 0,
    verifiedPct:
      list.length + contacts
        ? Math.round(
            ((list.filter((g) => g.verified).length + contacts) / (list.length + contacts)) * 100,
          )
        : 0,
    spark: {
      guardians: [1, 1, 1, 2, 2, 2, totalGuardians],
      active: [1, 2, 1, 2, 2, 2, activeNow],
      contacts: [2, 2, 3, 3, 3, 3, contacts],
      verified: [3, 3, 4, 4, 5, 5, verifiedProfiles],
      response: [4, 3.5, 3, 2.8, 2.5, 2.2, avgResponse],
    },
  }
}

export function categoryForContact(c: EmergencyContactRecord) {
  return c.category
}

export function getProtectedMembers() {
  return mapPoints.map((p, index) => ({
    id: p.id,
    number: index + 1,
    name: p.label,
    detail: p.nodeId,
    condition: p.condition,
  }))
}
