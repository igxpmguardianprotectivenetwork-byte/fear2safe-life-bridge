import { guardians } from "./mock"
import { myDevice } from "./devices"

/** Operator identity used across the Fear2Safe console (AppShell / Protection Centre). */
export const operatorProfile = {
  firstName: "Ahamed",
  lastName: "Hassan",
  fullName: "Ahamed Hassan",
  initials: "AH",
  role: "Guardian Admin",
  organization: "LifeBridge Guardian Centre",
  primaryLocation: "Colombo, Sri Lanka",
  dateOfBirth: null as string | null,
  emergencyContactPhone: guardians[0]?.phone ?? null,
  emergencyContactName: guardians[0]?.name ?? null,
}

export function getRememberedEmail(): string | null {
  try {
    const v = localStorage.getItem("f2s_remember")
    return v?.includes("@") ? v : null
  } catch {
    return null
  }
}

export function getSettingsAccountState() {
  const email = getRememberedEmail()
  const primary = guardians.find((g) => g.role === "Primary") ?? guardians[0]
  const secondary = guardians.find((g) => g.role === "Secondary" && g.id !== primary?.id) ?? guardians[1]

  return {
    profile: {
      ...operatorProfile,
      email,
      dateOfBirth: operatorProfile.dateOfBirth,
    },
    /** Only states the app can honestly represent without a security backend. */
    security: {
      passwordStatus: "Configured" as const,
      passwordHint: "Password is set for this session",
      twoFactor: "Not configured" as const,
      twoFactorHint: "Extra login protection is not set up yet",
      loginAlerts: "Active" as const,
      loginAlertsHint: "Get notified of new logins",
      trustedDevices: 1,
      trustedDevicesHint: "Devices signed into this console",
      lastReview: "Not set" as const,
      lastReviewHint: "No security review recorded",
    },
    guardians: {
      primary,
      secondary,
      total: guardians.length,
      escalationLabel: "Guardians First",
      escalationHint: `Ready · ${Math.min(guardians.length, 3)} guardians`,
      safeCheckEnabled: true,
    },
    devices: {
      wearable: myDevice,
      /** Browser/console session — not a fabricated phone model. */
      console: {
        name: "Fear2Safe Web Console",
        type: "Browser session",
        connected: true,
        lastSync: "Active now",
        battery: null as number | null,
      },
    },
    privacy: {
      dataSharing: "Limited",
      dataSharingHint: "Allow limited data sharing for safety services",
      visibility: "Custom",
      visibilityHint: "Control what information guardians can see",
      incidentAccess: "Guardians Only",
      incidentAccessHint: "Manage who can access incident reports",
    },
    bannerBadges: [
      myDevice.monitoringActive
        ? { id: "protection", label: "Protection Active", tone: "green" as const }
        : null,
      email ? { id: "email", label: "Email remembered", tone: "blue" as const } : null,
    ].filter(Boolean) as { id: string; label: string; tone: "green" | "blue" }[],
  }
}

export type SettingsNavId =
  | "profile"
  | "security"
  | "notifications"
  | "guardians"
  | "devices"
  | "privacy"
  | "help"
