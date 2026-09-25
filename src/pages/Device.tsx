import { useState } from "react"
import { BatteryMedium, Lightbulb, MapPin, Radio, Settings2, Siren, Watch } from "lucide-react"
import { Panel } from "../components/ui"

const tabs = ["Device Status", "Settings", "SOS", "Battery", "Help"] as const

function BandVisual() {
  return (
    <div className="relative mx-auto flex h-[280px] w-full max-w-[280px] items-center justify-center">
      <div className="absolute inset-8 rounded-full bg-pink/15 blur-2xl" />
      <svg viewBox="0 0 220 280" className="relative z-10 h-full w-auto drop-shadow-2xl" aria-hidden>
        <defs>
          <linearGradient id="bandMetal" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#2A2A2E" />
            <stop offset="0.5" stopColor="#111114" />
            <stop offset="1" stopColor="#3A3A40" />
          </linearGradient>
        </defs>
        {/* strap top */}
        <path d="M78 28 C78 10, 142 10, 142 28 L142 70 L78 70 Z" fill="url(#bandMetal)" />
        <rect x="78" y="70" width="64" height="28" rx="4" fill="#1A1A1E" />
        {/* body */}
        <rect x="62" y="92" width="96" height="118" rx="28" fill="url(#bandMetal)" />
        <rect x="72" y="104" width="76" height="94" rx="22" fill="#0A0A0C" />
        {/* screen glow */}
        <rect x="80" y="114" width="60" height="74" rx="16" fill="#12121A" stroke="#E91E63" strokeWidth="1.5" opacity="0.95" />
        <path
          d="M110 128 L122 134 L122 150 C122 158 116 164 110 167 C104 164 98 158 98 150 L98 134 Z"
          fill="#E91E63"
        />
        <circle cx="110" cy="148" r="18" fill="none" stroke="#E91E63" strokeWidth="2" opacity="0.45" />
        {/* strap bottom */}
        <rect x="78" y="210" width="64" height="28" rx="4" fill="#1A1A1E" />
        <path d="M78 238 L142 238 C142 262, 78 262, 78 238 Z" fill="url(#bandMetal)" />
        <circle cx="110" cy="248" r="4" fill="#444" />
      </svg>
    </div>
  )
}

export function Device() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Device Status")
  const battery = 78

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">My Protection Device</h1>
          <p className="mt-1 text-sm text-muted">Fear2Safe Band · FS-LifeBridge-01</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-mint-soft px-3.5 py-1.5 text-sm font-semibold text-mint">
          <span className="h-2 w-2 rounded-full bg-mint" /> Connected
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              tab === t ? "bg-navy text-white" : "border border-border bg-white text-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <Panel className="flex flex-col items-center justify-center">
          <BandVisual />
          <p className="mt-2 text-center text-sm font-medium text-muted">Life Bridge Wearable</p>
        </Panel>

        <div className="space-y-4">
          <Panel title="Connection Status">
            <div className="flex items-center gap-3 rounded-xl bg-mint-soft px-4 py-3">
              <Radio className="h-5 w-5 text-mint" />
              <div>
                <p className="font-bold text-navy">Connected</p>
                <p className="text-xs text-muted">Last sync 12 seconds ago · Bluetooth + LTE</p>
              </div>
            </div>
          </Panel>

          <Panel title="Battery Level">
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-2 font-medium text-navy">
                <BatteryMedium className="h-4 w-4 text-mint" /> {battery}%
              </span>
              <span className="text-muted">~18 hrs remaining</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-sky-deep transition-all" style={{ width: `${battery}%` }} />
            </div>
          </Panel>

          <Panel title="Location">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-navy">
              <MapPin className="h-4 w-4 text-sky-deep" /> Updating…
            </p>
            <p className="mt-1 text-xs text-muted">Precision: street-level · Safe zone nearby</p>
          </Panel>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Test SOS", icon: Siren, tone: "bg-pink-soft text-pink" },
          { label: "Find My Device", icon: Watch, tone: "bg-sky-soft text-sky-deep" },
          { label: "Device Settings", icon: Settings2, tone: "bg-navy/5 text-navy" },
        ].map((a) => {
          const Icon = a.icon
          return (
            <button
              key={a.label}
              className="flex flex-col items-center gap-3 rounded-[16px] border border-border bg-white p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
            >
              <div className={`rounded-2xl p-4 ${a.tone}`}>
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-bold text-navy">{a.label}</span>
            </button>
          )
        })}
      </div>

      <div className="flex items-start gap-3 rounded-[16px] border border-pink/20 bg-pink-soft/60 px-5 py-4">
        <div className="rounded-xl bg-pink/15 p-2.5 text-pink">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div>
          <p className="font-bold text-navy">Safety Tip</p>
          <p className="mt-0.5 text-sm text-muted">
            Keep your band charged above 20% when traveling alone. A quick double-press of the side
            button starts a silent SOS check-in with your primary guardian.
          </p>
        </div>
      </div>
    </div>
  )
}
