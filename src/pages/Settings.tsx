import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Bell,
  MapPin,
  Phone,
  ShieldAlert,
  Siren,
  TriangleAlert,
  WifiOff,
} from "lucide-react"
import { useAuth } from "../auth"
import { getSettingsAccountState, type SettingsNavId } from "../data/settingsProfile"
import {
  AccountSecurityCard,
  ConnectedDevicesCard,
  GuardianEmergencyCard,
  HelpPanel,
  NotificationPreferencesCard,
  PersonalInformationCard,
  PreferenceToggleRow,
  PrivacyCard,
  ProfileBanner,
  SettingsPageHeader,
  SettingsSidebar,
  profileFieldIcons,
} from "../components/settings/SettingsPageParts"

const prefs = [
  {
    id: "loc",
    label: "Location Sharing",
    desc: "Share live location with guardians",
    on: true,
    icon: <MapPin className="h-3.5 w-3.5" />,
  },
  {
    id: "alert",
    label: "Alert Notifications",
    desc: "Push and in-app alerts for high-priority events",
    on: true,
    icon: <Bell className="h-3.5 w-3.5" />,
  },
  {
    id: "sos",
    label: "SOS Confirmation",
    desc: "Ask before sending emergency SOS",
    on: false,
    icon: <Siren className="h-3.5 w-3.5" />,
  },
  {
    id: "weekly",
    label: "Weekly Safety Report",
    desc: "Email a summary every Monday",
    on: true,
    icon: <Bell className="h-3.5 w-3.5" />,
  },
  {
    id: "guardianCall",
    label: "Guardian Call Alerts",
    desc: "Receive calls during high-risk alerts",
    on: true,
    icon: <Phone className="h-3.5 w-3.5" />,
  },
  {
    id: "offline",
    label: "Device Offline Alerts",
    desc: "Notify if your device goes offline",
    on: true,
    icon: <WifiOff className="h-3.5 w-3.5" />,
  },
  {
    id: "zone",
    label: "Safe Zone Alerts",
    desc: "Notify on safe-zone exit or entry",
    on: true,
    icon: <ShieldAlert className="h-3.5 w-3.5" />,
  },
  {
    id: "verify",
    label: "Verification Requests",
    desc: "Notify when a protection event needs verification",
    on: true,
    icon: <TriangleAlert className="h-3.5 w-3.5" />,
  },
] as const

const sectionIds: Record<SettingsNavId, string> = {
  profile: "set-profile",
  security: "set-security",
  notifications: "set-notifications",
  guardians: "set-guardians",
  devices: "set-devices",
  privacy: "set-privacy",
  help: "set-help",
}

export function Settings() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const account = useMemo(() => getSettingsAccountState(), [])
  const [section, setSection] = useState<SettingsNavId>("profile")
  const [toggles, setToggles] = useState(() =>
    Object.fromEntries(prefs.map((p) => [p.id, p.on])),
  )

  useEffect(() => {
    const el = document.getElementById(sectionIds[section])
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [section])

  const onLogout = () => {
    if (!window.confirm("Log out of Fear2Safe?")) return
    logout()
    navigate("/", { replace: true })
  }

  const onEdit = () => {
    window.alert("Profile editing connects to your account API when available. Current values are unchanged.")
  }

  const fields = [
    {
      label: "Full Name",
      value: account.profile.fullName,
      icon: profileFieldIcons.name,
    },
    {
      label: "Date of Birth",
      value: account.profile.dateOfBirth ?? "Not set",
      icon: profileFieldIcons.dob,
    },
    {
      label: "Organization",
      value: account.profile.organization,
      icon: profileFieldIcons.org,
    },
    {
      label: "Primary Location",
      value: account.profile.primaryLocation,
      icon: profileFieldIcons.loc,
    },
    {
      label: "Email Address",
      value: account.profile.email ?? "Not set",
      icon: profileFieldIcons.email,
    },
    {
      label: "Emergency Contact",
      value: account.profile.emergencyContactPhone
        ? `${account.profile.emergencyContactName ?? "Guardian"} · ${account.profile.emergencyContactPhone}`
        : "Not set",
      icon: profileFieldIcons.phone,
    },
  ]

  const securityRows = [
    {
      label: "Password Status",
      hint: account.security.passwordHint,
      status: account.security.passwordStatus,
      tone: "blue" as const,
    },
    {
      label: "Two-Factor Authentication",
      hint: account.security.twoFactorHint,
      status: account.security.twoFactor,
      tone: "orange" as const,
    },
    {
      label: "Login Alerts",
      hint: account.security.loginAlertsHint,
      status: account.security.loginAlerts,
      tone: "green" as const,
    },
    {
      label: "Trusted Devices",
      hint: account.security.trustedDevicesHint,
      status: `${account.security.trustedDevices} Device`,
      tone: "blue" as const,
    },
    {
      label: "Last Security Review",
      hint: account.security.lastReviewHint,
      status: account.security.lastReview,
      tone: "muted" as const,
    },
  ]

  const privacyRows = [
    {
      label: "Data Sharing",
      hint: account.privacy.dataSharingHint,
      status: account.privacy.dataSharing,
    },
    {
      label: "Visibility to Guardians",
      hint: account.privacy.visibilityHint,
      status: account.privacy.visibility,
    },
    {
      label: "Incident Report Access",
      hint: account.privacy.incidentAccessHint,
      status: account.privacy.incidentAccess,
    },
  ]

  return (
    <div className="f2s-settings-page">
      <SettingsPageHeader />

      <div className="f2s-set-layout">
        <SettingsSidebar active={section} onSelect={setSection} onLogout={onLogout} />

        <div className="f2s-set-main">
          <ProfileBanner
            name={account.profile.fullName}
            role={account.profile.role}
            location={account.profile.primaryLocation}
            initials={account.profile.initials}
            badges={account.bannerBadges}
            onEdit={onEdit}
          />

          <div className="f2s-set-grid">
            <PersonalInformationCard fields={fields} onEdit={onEdit} />
            <AccountSecurityCard rows={securityRows} />
            <NotificationPreferencesCard>
              {prefs.map((p) => (
                <PreferenceToggleRow
                  key={p.id}
                  id={`pref-${p.id}`}
                  label={p.label}
                  desc={p.desc}
                  icon={p.icon}
                  on={toggles[p.id]}
                  onChange={() => setToggles((t) => ({ ...t, [p.id]: !t[p.id] }))}
                />
              ))}
            </NotificationPreferencesCard>
            <GuardianEmergencyCard
              primary={account.guardians.primary}
              secondary={account.guardians.secondary}
              escalationHint={account.guardians.escalationHint}
              escalationLabel={account.guardians.escalationLabel}
              safeCheckEnabled={account.guardians.safeCheckEnabled}
            />
            <ConnectedDevicesCard
              wearable={account.devices.wearable}
              consoleDevice={account.devices.console}
            />
            <PrivacyCard rows={privacyRows} />
          </div>

          <HelpPanel />
        </div>
      </div>
    </div>
  )
}
