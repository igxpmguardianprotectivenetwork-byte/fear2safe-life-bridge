import { useState } from "react"
import { MessageCircle, Phone, Plus, Search, Users } from "lucide-react"
import { emergencyContacts, guardians } from "../data/mock"
import { Panel } from "../components/ui"

const tabs = ["My Guardians", "Protected Members", "Support Network"] as const

export function Guardians() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("My Guardians")
  const [q, setQ] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">People & Guardians</h1>
          <p className="mt-1 text-sm text-muted">Your trusted circle for rapid response and care.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-pink px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink/25 hover:bg-pink-deep">
          <Plus className="h-4 w-4" /> Add Guardian
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search guardians and contacts…"
            className="w-full rounded-full border border-border bg-white py-2.5 pr-4 pl-10 text-sm outline-none focus:border-sky focus:ring-2 focus:ring-sky/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                tab === t ? "bg-navy text-white" : "bg-white text-muted border border-border"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {guardians
          .filter((g) => g.name.toLowerCase().includes(q.toLowerCase()))
          .map((g) => (
            <article
              key={g.id}
              className="rounded-[16px] border border-border bg-white p-5 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-sky-soft px-2.5 py-1 text-[11px] font-bold text-sky-deep uppercase">
                  {g.role} Guardian
                </span>
                <span className="rounded-full bg-mint-soft px-2.5 py-1 text-[11px] font-bold text-mint">
                  {g.status}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-extrabold text-white"
                  style={{ background: `linear-gradient(135deg, ${g.color}, #0B1F33)` }}
                >
                  {g.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy">{g.name}</h3>
                  <p className="text-sm text-muted">{g.relation}</p>
                  <p className="mt-1 text-sm font-medium text-navy">{g.phone}</p>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy py-2.5 text-sm font-semibold text-white">
                  <Phone className="h-4 w-4" /> Call
                </button>
                <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold text-navy hover:bg-bg">
                  <MessageCircle className="h-4 w-4" /> Message
                </button>
              </div>
            </article>
          ))}
      </div>

      <Panel title="Emergency Contacts">
        <ul className="divide-y divide-border">
          {emergencyContacts.map((c) => (
            <li key={c.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-soft text-sm font-bold text-sky-deep">
                {c.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-navy">{c.name}</p>
                <p className="text-xs text-muted">
                  {c.relation} · {c.phone}
                </p>
              </div>
              <button className="rounded-full border border-border p-2.5 text-navy hover:bg-bg" aria-label="Call">
                <Phone className="h-4 w-4" />
              </button>
              <button className="rounded-full border border-border p-2.5 text-navy hover:bg-bg" aria-label="Message">
                <MessageCircle className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="flex items-center gap-4 rounded-[16px] border border-sky/30 bg-gradient-to-r from-sky-soft to-white px-5 py-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky/20 text-sky-deep">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <p className="font-bold text-navy">A stronger circle. A safer tomorrow.</p>
          <p className="text-sm text-muted">Invite trusted people so help arrives faster when it matters.</p>
        </div>
      </div>
    </div>
  )
}
