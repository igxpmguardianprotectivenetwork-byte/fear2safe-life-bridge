import {
  Activity,
  BadgeCheck,
  ChevronRight,
  CircleCheck,
  Clock3,
  Crown,
  ExternalLink,
  MessageCircle,
  Phone,
  PhoneCall,
  Plus,
  RadioTower,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  UsersRound,
  Zap,
} from "lucide-react"
import { Link } from "react-router-dom"
import type { ReactNode } from "react"
import type { EmergencyContactRecord, GuardianRecord } from "./guardiansState"
import {
  deriveNetworkHealth,
  deriveReadiness,
  getGuardiansNetworkStats,
  getProtectedMembers,
} from "./guardiansState"

function MiniSparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 0.001)
  const min = Math.min(...values)
  const range = Math.max(max - min, 0.001)
  const w = 70
  const h = 26
  const pts = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * w
      const y = h - ((v - min) / range) * (h - 4) - 2
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="f2s-g-spark">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
        opacity={0.9}
      />
    </svg>
  )
}

export function GuardiansHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <header className="f2s-g-header">
      <div className="min-w-0">
        <h1>People & Guardians</h1>
        <p>Your trusted circle for rapid response and care.</p>
      </div>
      <button type="button" className="f2s-g-add-btn" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        Add Guardian
      </button>
    </header>
  )
}

export function GuardianSearchTabs({
  q,
  onQuery,
  tab,
  onTab,
}: {
  q: string
  onQuery: (v: string) => void
  tab: "My Guardians" | "Protected Members" | "Support Network"
  onTab: (t: "My Guardians" | "Protected Members" | "Support Network") => void
}) {
  const tabs = ["My Guardians", "Protected Members", "Support Network"] as const
  return (
    <div className="f2s-g-search-row">
      <div className="f2s-g-search">
        <Search className="f2s-g-search-icon" aria-hidden />
        <input
          value={q}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search guardians and contacts..."
          aria-label="Search guardians and contacts"
        />
      </div>
      <div className="f2s-g-tabs" role="tablist" aria-label="Guardian categories">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={`f2s-g-tab ${tab === t ? "is-active" : ""}`}
            onClick={() => onTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}

export function GuardianStatsGrid({ userId }: { userId?: string }) {
  const s = getGuardiansNetworkStats(userId)
  const cards = [
    {
      title: "Total Guardians",
      value: String(s.totalGuardians),
      sub: "+1 from last month",
      icon: <UsersRound className="h-4 w-4" />,
      tone: "blue" as const,
      color: "#149FE8",
      spark: s.spark.guardians,
    },
    {
      title: "Active Now",
      value: String(s.activeNow),
      sub: `${s.activePct}% online`,
      icon: <RadioTower className="h-4 w-4" />,
      tone: "green" as const,
      color: "#14B882",
      spark: s.spark.active,
    },
    {
      title: "Emergency Contacts",
      value: String(s.contacts),
      sub: "+0 this month",
      icon: <PhoneCall className="h-4 w-4" />,
      tone: "pink" as const,
      color: "#F21863",
      spark: s.spark.contacts,
    },
    {
      title: "Verified Profiles",
      value: String(s.verifiedProfiles),
      sub: `${s.verifiedPct}% verified`,
      icon: <ShieldCheck className="h-4 w-4" />,
      tone: "cyan" as const,
      color: "#18C6EA",
      spark: s.spark.verified,
    },
    {
      title: "Avg. Response Time",
      value: `~ ${s.avgResponseMinutes} min`,
      sub: "↓ 40% faster",
      icon: <Clock3 className="h-4 w-4" />,
      tone: "orange" as const,
      color: "#F5A214",
      spark: s.spark.response,
    },
  ]

  return (
    <div className="f2s-g-stats">
      {cards.map((c) => (
        <article key={c.title} className={`f2s-g-stat f2s-g-stat--${c.tone}`}>
          <div className="f2s-g-stat-top">
            <span className="f2s-g-stat-icon">{c.icon}</span>
            <MiniSparkline values={c.spark} color={c.color} />
          </div>
          <p className="f2s-g-stat-value">{c.value}</p>
          <p className="f2s-g-stat-title">{c.title}</p>
          <p className="f2s-g-stat-sub">{c.sub}</p>
        </article>
      ))}
    </div>
  )
}

function ReadinessBar({
  score,
  tone,
}: {
  score: number
  tone: "pink" | "blue"
}) {
  const segs = 12
  const filled = Math.round((score / 100) * segs)
  return (
    <div className="f2s-g-ready-bar" aria-hidden>
      {Array.from({ length: segs }).map((_, i) => (
        <span
          key={i}
          className={`f2s-g-ready-seg ${i < filled ? `is-on is-${tone}` : ""}`}
        />
      ))}
    </div>
  )
}

export function GuardianCard({ guardian }: { guardian: GuardianRecord }) {
  const readiness = deriveReadiness(guardian)
  const isPrimary = guardian.role === "Primary"
  const tone = isPrimary ? ("pink" as const) : ("blue" as const)

  return (
    <article className={`f2s-g-card ${isPrimary ? "is-primary" : "is-secondary"}`}>
      <div className="f2s-g-card-top">
        <div className="f2s-g-role">
          <span className="f2s-g-role-icon">
            {isPrimary ? <Crown className="h-3.5 w-3.5" /> : <UserRound className="h-3.5 w-3.5" />}
          </span>
          <div className="min-w-0">
            <p className="f2s-g-role-label">
              {isPrimary ? "Primary Guardian" : "Secondary Guardian"}
            </p>
            <p className="f2s-g-role-sub">
              {isPrimary
                ? "Highest priority · First to be notified"
                : "Backup contact · Next in line"}
            </p>
          </div>
        </div>
        <span className="f2s-g-active">
          <span className="f2s-g-active-dot" />
          {guardian.status}
        </span>
      </div>

      <div className="f2s-g-identity">
        <div className="f2s-g-avatar" style={{ background: guardian.color }}>
          {guardian.avatar}
        </div>
        <div className="min-w-0">
          <h3>{guardian.name}</h3>
          <p>{guardian.relation}</p>
          <a className="f2s-g-phone" href={`tel:${guardian.phone.replace(/\s/g, "")}`}>
            {guardian.phone}
          </a>
        </div>
      </div>

      <div className="f2s-g-metrics">
        <div>
          <span className="f2s-g-metric-icon">
            <Phone className="h-3.5 w-3.5" />
          </span>
          <p className="f2s-g-metric-label">Preferred Contact</p>
          <p className="f2s-g-metric-value">{guardian.preferredContact}</p>
        </div>
        <div>
          <span className="f2s-g-metric-icon">
            <Clock3 className="h-3.5 w-3.5" />
          </span>
          <p className="f2s-g-metric-label">Last Response</p>
          <p className="f2s-g-metric-value">{guardian.lastResponse}</p>
        </div>
        <div>
          <span className="f2s-g-metric-icon">
            <ShieldCheck className="h-3.5 w-3.5" />
          </span>
          <p className="f2s-g-metric-label">Verification</p>
          <p className="f2s-g-metric-value">
            {guardian.verified ? (
              <span className="f2s-g-verified">
                <BadgeCheck className="h-3.5 w-3.5" /> Verified
              </span>
            ) : (
              "Pending"
            )}
          </p>
        </div>
        <div>
          <span className="f2s-g-metric-icon">
            <RadioTower className="h-3.5 w-3.5" />
          </span>
          <p className="f2s-g-metric-label">Availability</p>
          <p className="f2s-g-metric-value">{guardian.availability}</p>
          <p className="f2s-g-metric-hint">Reachable now</p>
        </div>
      </div>

      <div className="f2s-g-ready">
        <div className="f2s-g-ready-copy">
          <span className={`f2s-g-ready-bolt is-${tone}`}>
            <Zap className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <p className="f2s-g-ready-title">{readiness.label}</p>
            <p className="f2s-g-ready-hint">{readiness.hint}</p>
          </div>
        </div>
        <div className="f2s-g-ready-right">
          <ReadinessBar score={readiness.score} tone={tone} />
          <span className="f2s-g-ready-pct">{readiness.score}%</span>
        </div>
      </div>

      <div className="f2s-g-actions">
        <a
          className="f2s-g-btn f2s-g-btn--call"
          href={`tel:${guardian.phone.replace(/\s/g, "")}`}
        >
          <Phone className="h-4 w-4" />
          Call
        </a>
        <Link to="/messages" className="f2s-g-btn f2s-g-btn--ghost">
          <MessageCircle className="h-4 w-4" />
          Message
        </Link>
        <Link to="/settings" className="f2s-g-btn f2s-g-btn--ghost">
          <UserRound className="h-4 w-4" />
          View Profile
        </Link>
      </div>
    </article>
  )
}

export function EmergencyContactsPanel({
  contacts,
  onAdd,
}: {
  contacts: EmergencyContactRecord[]
  onAdd: () => void
}) {
  return (
    <section className="f2s-g-panel">
      <div className="f2s-g-panel-head">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="f2s-g-sec-icon">
            <UsersRound className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2>
              Emergency Contacts
              <span className="f2s-g-badge">{contacts.length}</span>
            </h2>
            <p>Additional trusted contacts for extended support.</p>
          </div>
        </div>
        <button type="button" className="f2s-g-add-contact" onClick={onAdd}>
          <Plus className="h-3.5 w-3.5" />
          Add Contact
        </button>
      </div>
      <ul className="f2s-g-contact-list">
        {contacts.map((c) => (
          <li key={c.id} className="f2s-g-contact-row">
            <div className="f2s-g-contact-avatar">{c.avatar}</div>
            <div className="min-w-0 flex-1">
              <p className="f2s-g-contact-name">{c.name}</p>
              <p className="f2s-g-contact-meta">
                {c.relation} · {c.phone}
              </p>
            </div>
            <span className={`f2s-g-tag f2s-g-tag--${c.category.toLowerCase()}`}>
              {c.category}
            </span>
            <a
              className="f2s-g-icon-btn"
              href={`tel:${c.phone.replace(/\s/g, "")}`}
              aria-label={`Call ${c.name}`}
            >
              <Phone className="h-3.5 w-3.5" />
            </a>
            <Link
              to="/messages"
              className="f2s-g-icon-btn"
              aria-label={`Message ${c.name}`}
            >
              <MessageCircle className="h-3.5 w-3.5" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function GuardianActivityPanel() {
  const items = [
    {
      tone: "green" as const,
      title: "Primary guardian acknowledged alert",
      detail: "M. S. Perera responded to location alert",
      time: "2 min ago",
      icon: <CircleCheck className="h-3.5 w-3.5" />,
    },
    {
      tone: "blue" as const,
      title: "Check-in request sent",
      detail: "Check-in request sent to Nimali Silva",
      time: "18 min ago",
      icon: <MessageCircle className="h-3.5 w-3.5" />,
    },
    {
      tone: "orange" as const,
      title: "School contact reached",
      detail: "Ms. Kavitha was contacted via phone",
      time: "1 hour ago",
      icon: <PhoneCall className="h-3.5 w-3.5" />,
    },
    {
      tone: "purple" as const,
      title: "Support network notified",
      detail: "Emergency contacts were informed",
      time: "3 hours ago",
      icon: <UsersRound className="h-3.5 w-3.5" />,
    },
    {
      tone: "green" as const,
      title: "All guardians are active",
      detail: "System health check completed",
      time: "5 hours ago",
      icon: <Activity className="h-3.5 w-3.5" />,
    },
  ]

  return (
    <section className="f2s-g-panel">
      <div className="f2s-g-panel-head">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="f2s-g-sec-icon">
            <Activity className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2>Guardian Activity</h2>
            <p>Recent interactions and responses from your guardians.</p>
          </div>
        </div>
        <Link to="/alerts/risk-detected" className="f2s-g-viewall">
          View All <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <ul className="f2s-g-activity">
        {items.map((item) => (
          <li key={item.title} className={`f2s-g-activity-item tone-${item.tone}`}>
            <span className="f2s-g-activity-node">{item.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="f2s-g-activity-title">{item.title}</p>
              <p className="f2s-g-activity-detail">{item.detail}</p>
            </div>
            <time>{item.time}</time>
          </li>
        ))}
      </ul>
    </section>
  )
}

function CoverageRing({ pct }: { pct: number }) {
  const r = 46
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <div className="f2s-g-ring" aria-label={`Network health ${pct} percent`}>
      <svg viewBox="0 0 120 120" width="120" height="120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#E8F1F7" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="url(#f2sGRing)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
        />
        <defs>
          <linearGradient id="f2sGRing" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#009FA5" />
            <stop offset="100%" stopColor="#18C6EA" />
          </linearGradient>
        </defs>
      </svg>
      <div className="f2s-g-ring-label">
        <strong>{pct}%</strong>
        <span>Network</span>
        <em>Health</em>
      </div>
    </div>
  )
}

export function CoverageReadinessPanel({ userId }: { userId?: string }) {
  const h = deriveNetworkHealth(userId)
  const checks: { ok: boolean; title: string; sub: string }[] = [
    {
      ok: h.allActive,
      title: `${h.activeGuardians}/${h.totalGuardians} Guardians Active`,
      sub: "All primary guardians online",
    },
    {
      ok: h.contacts >= 3,
      title: `${h.contacts} Emergency Contacts`,
      sub: "Extended network configured",
    },
    {
      ok: h.allVerified,
      title: "100% Verified Profiles",
      sub: "All guardians verified",
    },
    {
      ok: h.escalationReady,
      title: "Escalation Chain Ready",
      sub: "Proper sequence configured",
    },
  ]

  return (
    <section className="f2s-g-panel">
      <div className="f2s-g-panel-head">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="f2s-g-sec-icon">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2>Coverage & Readiness</h2>
            <p>Your safety network is ready and protected.</p>
          </div>
        </div>
        <Link to="/reports" className="f2s-g-viewall">
          View Details <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="f2s-g-coverage-body">
        <CoverageRing pct={h.pct} />
        <ul className="f2s-g-checklist">
          {checks.map((c) => (
            <li key={c.title}>
              <CircleCheck
                className={`h-4 w-4 shrink-0 ${c.ok ? "text-[#14B882]" : "text-[#6A8099]"}`}
              />
              <div className="min-w-0">
                <p>{c.title}</p>
                <span>{c.sub}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="f2s-g-sync">
        <span>
          <RefreshCw className="h-3.5 w-3.5" />
          Last synced: 2 minutes ago
        </span>
        <span className="f2s-g-ops">
          <span className="f2s-g-active-dot" />
          All systems operational
        </span>
      </div>
    </section>
  )
}

export function CommunityTrustBanner() {
  return (
    <aside className="f2s-g-banner">
      <div className="f2s-g-banner-left">
        <span className="f2s-g-banner-icon">
          <UsersRound className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="f2s-g-banner-title">A stronger circle. A safer tomorrow.</p>
          <p className="f2s-g-banner-sub">
            Invite trusted people so help arrives faster when it matters. Together, we can create a
            safer, more connected community.
          </p>
        </div>
      </div>
      <a href="#learn-more" className="f2s-g-learn">
        Learn More
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </aside>
  )
}

export function ProtectedMembersPanel({ query }: { query: string }) {
  const q = query.trim().toLowerCase()
  const members = getProtectedMembers().filter(
    (m) => !q || m.name.toLowerCase().includes(q) || m.detail.toLowerCase().includes(q),
  )
  return (
    <section className="f2s-g-panel f2s-g-alt-panel">
      <div className="f2s-g-panel-head">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="f2s-g-sec-icon">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h2>Protected Members</h2>
            <p>People this account monitors across the protection network.</p>
          </div>
        </div>
      </div>
      <ul className="f2s-g-member-list">
        {members.map((m) => (
          <li key={m.id}>
            <div className="f2s-g-contact-avatar">{m.number}</div>
            <div className="min-w-0 flex-1">
              <p className="f2s-g-contact-name">
                User {m.number} · {m.name}
              </p>
              <p className="f2s-g-contact-meta">{m.detail}</p>
            </div>
            <Link to={`/dashboard?tab=vitals&user=${m.id}`} className="f2s-g-viewall">
              Live vitals <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function EmptyHint({ children }: { children: ReactNode }) {
  return <p className="f2s-g-empty">{children}</p>
}

export function ProtectedUserPicker({
  selectedId,
  onSelect,
}: {
  selectedId: string
  onSelect: (id: string) => void
}) {
  const members = getProtectedMembers()
  return (
    <section className="f2s-g-user-picker" aria-label="Select protected user">
      <div className="f2s-g-user-picker-head">
        <h2>Protected Users</h2>
        <p>Select a person to view their guardian circle.</p>
      </div>
      <div className="f2s-g-user-picker-row">
        {members.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`f2s-g-user-chip ${m.id === selectedId ? "is-active" : ""} tone-${m.condition}`}
            onClick={() => onSelect(m.id)}
          >
            <span className="f2s-g-user-num">{m.number}</span>
            <span className="min-w-0 text-left">
              <strong>{m.name}</strong>
              <em>{m.detail}</em>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
