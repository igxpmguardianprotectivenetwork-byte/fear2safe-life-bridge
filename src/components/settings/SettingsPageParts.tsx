import type { ReactNode } from "react"
import {
  BadgeCheck,
  Bell,
  Building2,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  Download,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MonitorSmartphone,
  Pencil,
  Phone,
  Plus,
  Shield,
  ShieldCheck,
  Smartphone,
  UserRound,
  UsersRound,
  Watch,
  BatteryMedium,
  Wifi,
} from "lucide-react"
import { Link } from "react-router-dom"
import type { SettingsNavId } from "../../data/settingsProfile"
import type { GuardianRecord } from "../guardians/guardiansState"
import type { ProtectionDevice } from "../../data/devices"

export const settingsNavItems: {
  id: SettingsNavId
  label: string
  icon: typeof UserRound
}[] = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "guardians", label: "Guardian Settings", icon: UsersRound },
  { id: "devices", label: "Connected Devices", icon: Smartphone },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "help", label: "Help", icon: CircleHelp },
]

export function SettingsPageHeader() {
  return (
    <header className="f2s-set-header">
      <div className="min-w-0">
        <h1>Profile & Settings</h1>
        <p>Manage your identity, privacy, security, and safety preferences.</p>
      </div>
      <div className="f2s-set-header-art" aria-hidden>
        <ShieldCheck className="h-10 w-10" />
        <span>A Safer Tomorrow Together</span>
      </div>
    </header>
  )
}

export function SettingsSidebar({
  active,
  onSelect,
  onLogout,
}: {
  active: SettingsNavId
  onSelect: (id: SettingsNavId) => void
  onLogout: () => void
}) {
  return (
    <aside className="f2s-set-sidebar" aria-label="Settings sections">
      <nav className="f2s-set-nav">
        {settingsNavItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              className={`f2s-set-nav-item ${active === item.id ? "is-active" : ""}`}
              onClick={() => onSelect(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
      </nav>
      <button type="button" className="f2s-set-logout" onClick={onLogout}>
        <LogOut className="h-4 w-4" />
        Log Out
      </button>
    </aside>
  )
}

export function ProfileBanner({
  name,
  role,
  location,
  initials,
  badges,
  onEdit,
}: {
  name: string
  role: string
  location: string
  initials: string
  badges: { id: string; label: string; tone: "green" | "blue" }[]
  onEdit: () => void
}) {
  return (
    <section className="f2s-set-banner">
      <div className="f2s-set-banner-left">
        <div className="f2s-set-avatar">{initials}</div>
        <div className="min-w-0">
          <h2>{name}</h2>
          <p>
            {role} · {location}
          </p>
          {badges.length > 0 ? (
            <div className="f2s-set-badges">
              {badges.map((b) => (
                <span key={b.id} className={`f2s-set-badge tone-${b.tone}`}>
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {b.label}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <button type="button" className="f2s-set-edit-btn" onClick={onEdit}>
        <Pencil className="h-4 w-4" />
        Edit Profile
      </button>
    </section>
  )
}

function CardShell({
  id,
  icon,
  title,
  subtitle,
  action,
  children,
}: {
  id?: string
  icon: ReactNode
  title: string
  subtitle: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} className="f2s-set-card">
      <div className="f2s-set-card-head">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="f2s-set-card-icon">{icon}</span>
          <div className="min-w-0">
            <h3>{title}</h3>
            <p>{subtitle}</p>
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

export function PersonalInformationCard({
  fields,
  onEdit,
}: {
  fields: { label: string; value: string; icon: ReactNode }[]
  onEdit: () => void
}) {
  return (
    <CardShell
      id="set-profile"
      icon={<UserRound className="h-4 w-4" />}
      title="Personal Information"
      subtitle="Your basic information and contact details."
      action={
        <button type="button" className="f2s-set-mini-btn" onClick={onEdit}>
          Edit
        </button>
      }
    >
      <div className="f2s-set-fields">
        {fields.map((f) => (
          <div key={f.label} className="f2s-set-field">
            <span className="f2s-set-field-icon">{f.icon}</span>
            <div className="min-w-0">
              <p className="lbl">{f.label}</p>
              <p className="val">{f.value}</p>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  )
}

export function AccountSecurityCard({
  rows,
}: {
  rows: { label: string; hint: string; status: string; tone: "green" | "blue" | "muted" | "orange" }[]
}) {
  return (
    <CardShell
      id="set-security"
      icon={<Lock className="h-4 w-4" />}
      title="Account Security"
      subtitle="Keep your account secure and monitored."
    >
      <ul className="f2s-set-rows">
        {rows.map((r) => (
          <li key={r.label}>
            <span className="f2s-set-row-icon">
              <KeyRound className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="title">{r.label}</p>
              <p className="hint">{r.hint}</p>
            </div>
            <span className={`f2s-set-status tone-${r.tone}`}>{r.status}</span>
            <ChevronRight className="h-4 w-4 text-[#9BB0C3]" />
          </li>
        ))}
      </ul>
    </CardShell>
  )
}

export function PreferenceToggleRow({
  id,
  label,
  desc,
  icon,
  on,
  onChange,
}: {
  id: string
  label: string
  desc: string
  icon: ReactNode
  on: boolean
  onChange: () => void
}) {
  return (
    <li className="f2s-set-toggle-row">
      <span className="f2s-set-row-icon">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="title">{label}</p>
        <p className="hint">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        id={id}
        className={`f2s-set-switch ${on ? "is-on" : ""}`}
        onClick={onChange}
      >
        <span />
      </button>
    </li>
  )
}

export function NotificationPreferencesCard({ children }: { children: ReactNode }) {
  return (
    <CardShell
      id="set-notifications"
      icon={<Bell className="h-4 w-4" />}
      title="Notification & Safety Preferences"
      subtitle="Choose what alerts and updates you receive."
    >
      <ul className="f2s-set-toggle-list">{children}</ul>
    </CardShell>
  )
}

export function GuardianEmergencyCard({
  primary,
  secondary,
  escalationHint,
  escalationLabel,
  safeCheckEnabled,
}: {
  primary?: GuardianRecord
  secondary?: GuardianRecord
  escalationHint: string
  escalationLabel: string
  safeCheckEnabled: boolean
}) {
  return (
    <CardShell
      id="set-guardians"
      icon={<UsersRound className="h-4 w-4" />}
      title="Guardian & Emergency Settings"
      subtitle="Manage your guardians and emergency response preferences."
    >
      <ul className="f2s-set-rows">
        <li>
          <span className="f2s-set-row-icon">
            <UserRound className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="title">Primary Guardian</p>
            <p className="hint">
              {primary
                ? `${primary.name} · ${primary.relation.split("·")[0]?.trim()} · ${primary.phone}`
                : "Not set"}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-[#9BB0C3]" />
        </li>
        <li>
          <span className="f2s-set-row-icon">
            <UsersRound className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="title">Secondary Guardian</p>
            <p className="hint">
              {secondary
                ? `${secondary.name} · ${secondary.relation.split("·")[0]?.trim()}`
                : "Not set"}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-[#9BB0C3]" />
        </li>
        <li>
          <span className="f2s-set-row-icon">
            <ShieldCheck className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="title">Escalation Order</p>
            <p className="hint">{escalationHint}</p>
          </div>
          <span className="f2s-set-status tone-green">Active</span>
          <ChevronRight className="h-4 w-4 text-[#9BB0C3]" />
        </li>
        <li>
          <span className="f2s-set-row-icon">
            <Bell className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="title">Safe-Check Notifications</p>
            <p className="hint">Notify guardians if check-in is missed</p>
          </div>
          <span className={`f2s-set-status ${safeCheckEnabled ? "tone-green" : "tone-muted"}`}>
            {safeCheckEnabled ? "Enabled" : "Off"}
          </span>
          <ChevronRight className="h-4 w-4 text-[#9BB0C3]" />
        </li>
        <li>
          <span className="f2s-set-row-icon">
            <Phone className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="title">Emergency Response Preference</p>
            <p className="hint">How Fear2Safe prioritizes response contacts</p>
          </div>
          <span className="f2s-set-status tone-blue">{escalationLabel}</span>
          <ChevronRight className="h-4 w-4 text-[#9BB0C3]" />
        </li>
      </ul>
    </CardShell>
  )
}

export function ConnectedDevicesCard({
  wearable,
  consoleDevice,
}: {
  wearable: ProtectionDevice
  consoleDevice: {
    name: string
    type: string
    connected: boolean
    lastSync: string
    battery: number | null
  }
}) {
  return (
    <CardShell
      id="set-devices"
      icon={<Watch className="h-4 w-4" />}
      title="Connected Devices"
      subtitle="Manage your connected devices and their status."
      action={
        <Link to="/device" className="f2s-set-mini-btn">
          <Plus className="h-3.5 w-3.5" />
          Add Device
        </Link>
      }
    >
      <ul className="f2s-set-device-list">
        <li>
          <span className="f2s-set-device-thumb">
            <Watch className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="title">{wearable.name}</p>
            <p className="hint">
              Wearable · Last synced {wearable.lastSync}
            </p>
          </div>
          <span className="f2s-set-status tone-green">
            {wearable.connected ? "Connected" : "Offline"}
          </span>
          <span className="f2s-set-batt">
            <BatteryMedium className="h-3.5 w-3.5" />
            {wearable.battery}%
          </span>
          <ChevronRight className="h-4 w-4 text-[#9BB0C3]" />
        </li>
        <li>
          <span className="f2s-set-device-thumb teal">
            <MonitorSmartphone className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="title">{consoleDevice.name}</p>
            <p className="hint">
              {consoleDevice.type} · {consoleDevice.lastSync}
            </p>
          </div>
          <span className="f2s-set-status tone-green">
            {consoleDevice.connected ? "Connected" : "Offline"}
          </span>
          <span className="f2s-set-batt">
            <Wifi className="h-3.5 w-3.5" />
            Live
          </span>
          <ChevronRight className="h-4 w-4 text-[#9BB0C3]" />
        </li>
        <li className="is-add">
          <Link to="/device" className="f2s-set-add-device">
            <Plus className="h-4 w-4" />
            Connect a new device
          </Link>
        </li>
      </ul>
    </CardShell>
  )
}

export function PrivacyCard({
  rows,
}: {
  rows: { label: string; hint: string; status: string }[]
}) {
  return (
    <CardShell
      id="set-privacy"
      icon={<Shield className="h-4 w-4" />}
      title="Privacy"
      subtitle="Control your data and privacy settings."
    >
      <ul className="f2s-set-rows">
        {rows.map((r) => (
          <li key={r.label}>
            <span className="f2s-set-row-icon">
              <Shield className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="title">{r.label}</p>
              <p className="hint">{r.hint}</p>
            </div>
            <span className="f2s-set-status tone-blue">{r.status}</span>
            <ChevronRight className="h-4 w-4 text-[#9BB0C3]" />
          </li>
        ))}
        <li>
          <span className="f2s-set-row-icon">
            <Download className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="title">Download My Data</p>
            <p className="hint">Get a copy of your account and protection data</p>
          </div>
          <ChevronRight className="h-4 w-4 text-[#9BB0C3]" />
        </li>
      </ul>
    </CardShell>
  )
}

export function HelpPanel() {
  const links = [
    "Help Centre",
    "Emergency Use Guide",
    "Device Setup",
    "Guardian Setup",
    "Privacy & Security",
    "Contact Support",
  ]
  return (
    <CardShell
      id="set-help"
      icon={<CircleHelp className="h-4 w-4" />}
      title="Help"
      subtitle="Guides and support for your Fear2Safe account."
    >
      <ul className="f2s-set-help-list">
        {links.map((l) => (
          <li key={l}>
            <button type="button">
              {l}
              <ChevronRight className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </CardShell>
  )
}

export const profileFieldIcons = {
  name: <UserRound className="h-3.5 w-3.5" />,
  dob: <CalendarDays className="h-3.5 w-3.5" />,
  org: <Building2 className="h-3.5 w-3.5" />,
  loc: <MapPin className="h-3.5 w-3.5" />,
  email: <Mail className="h-3.5 w-3.5" />,
  phone: <Phone className="h-3.5 w-3.5" />,
}
