import { useState } from "react"
import { Shield } from "lucide-react"
import { Panel } from "../components/ui"

const sections = ["Profile", "Security", "Notifications", "Guardian Settings", "Privacy", "Help"] as const

const prefs = [
  { id: "loc", label: "Location Sharing", desc: "Share live location with guardians", on: true },
  { id: "alert", label: "Alert Notifications", desc: "Push and SMS for high-priority events", on: true },
  { id: "sos", label: "SOS Confirmation", desc: "Ask before sending emergency SOS", on: false },
  { id: "weekly", label: "Weekly Safety Report", desc: "Email a summary every Monday", on: true },
]

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onChange}
      className={`relative h-7 w-12 rounded-full transition ${on ? "bg-sky-deep" : "bg-border"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
          on ? "translate-x-5" : ""
        }`}
      />
    </button>
  )
}

export function Settings() {
  const [section, setSection] = useState<(typeof sections)[number]>("Profile")
  const [toggles, setToggles] = useState(() => Object.fromEntries(prefs.map((p) => [p.id, p.on])))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Profile & Settings</h1>
        <p className="mt-1 text-sm text-muted">Manage your identity, privacy, and safety preferences.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[16px] border border-border bg-gradient-to-r from-navy to-navy-2 p-5 text-white shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink to-sky text-xl font-extrabold">
            AH
          </div>
          <div>
            <p className="text-xl font-extrabold">Ahamed Hassan</p>
            <p className="text-sm text-white/70">Guardian Admin · Bengaluru</p>
          </div>
        </div>
        <button className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-navy hover:bg-pink-soft">
          Edit Profile
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-[16px] border border-border bg-white p-2 shadow-[var(--shadow-soft)]">
          {sections.map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`mb-1 w-full rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold ${
                section === s ? "bg-pink text-white" : "text-muted hover:bg-bg hover:text-navy"
              }`}
            >
              {s}
            </button>
          ))}
          <button className="mt-2 w-full rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold text-[#E53935] hover:bg-red-50">
            Log Out
          </button>
        </aside>

        <div className="space-y-5">
          <Panel title="Personal Information">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Full Name", "Ahamed Hassan"],
                ["Date of Birth", "14 Mar 1994"],
                ["School / Org", "Life Bridge Guardian Centre"],
                ["Emergency Contact", "+91 98765 43210"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border bg-bg px-4 py-3">
                  <p className="text-xs font-medium text-muted">{k}</p>
                  <p className="mt-1 text-sm font-bold text-navy">{v}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Preferences">
            <ul className="divide-y divide-border">
              {prefs.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-bold text-navy">{p.label}</p>
                    <p className="text-xs text-muted">{p.desc}</p>
                  </div>
                  <Toggle
                    on={toggles[p.id]}
                    onChange={() => setToggles((t) => ({ ...t, [p.id]: !t[p.id] }))}
                  />
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 rounded-[16px] border border-sky/30 bg-sky-soft px-5 py-4 text-sm font-medium text-navy">
        <Shield className="h-5 w-5 text-sky-deep" />
        Your safety matters. We are with you, always.
      </div>
    </div>
  )
}
