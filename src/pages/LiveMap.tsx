import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { mapPoints } from "../data/mock"
import { GoogleLiveMap } from "../components/GoogleLiveMap"

const filters = ["All", "Alerts", "Protected", "Guardians", "Safe Zones"] as const

const colors = {
  alert: "#E91E63",
  protected: "#29B6F6",
  guardian: "#0B1F33",
  safe: "#22C55E",
  verify: "#4FC3F7",
}

const legend = [
  { label: "Risk / Alert", color: colors.alert },
  { label: "Protected", color: colors.protected },
  { label: "Guardian", color: colors.guardian },
  { label: "Safe Zone", color: colors.safe },
  { label: "Under Verification", color: colors.verify },
  { label: "Your live GPS", color: "#E91E63" },
]

export function LiveMap() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All")
  const [q, setQ] = useState("")

  const markers = useMemo(() => {
    return mapPoints
      .filter((p) => {
        if (filter === "All") return true
        if (filter === "Alerts") return p.type === "alert"
        if (filter === "Protected") return p.type === "protected" || p.type === "verify"
        if (filter === "Guardians") return p.type === "guardian"
        if (filter === "Safe Zones") return p.type === "safe"
        return true
      })
      .filter((p) => p.label.toLowerCase().includes(q.toLowerCase()))
      .map((p) => ({
        id: p.id,
        lat: p.lat,
        lng: p.lng,
        label: p.label,
        color: colors[p.type],
        detail: p.type,
      }))
  }, [filter, q])

  return (
    <div className="-m-4 flex h-[calc(100vh-5.5rem)] flex-col sm:-m-6 lg:-m-8">
      <div className="flex flex-wrap items-center gap-3 border-b border-[#e5a0b4] bg-white/90 px-4 py-3 sm:px-6">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8a6b78]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search map…"
            className="w-full rounded-full border border-[#e5a0b4] bg-[#fff8fb] py-2.5 pr-4 pl-10 text-sm outline-none focus:border-pink focus:ring-2 focus:ring-pink/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold ${
                filter === f ? "bg-pink text-white" : "border border-border bg-white text-muted"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <GoogleLiveMap
          markers={markers}
          className="h-full rounded-none border-0"
          fallbackCenter={{ lat: 6.9271, lng: 79.8612 }}
          zoom={13}
          showLiveUser
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-[#e5a0b4] bg-white/90 px-4 py-3 sm:px-6">
        <p className="text-xs font-bold tracking-wide text-[#8a6b78] uppercase">Legend</p>
        {legend.map((l) => (
          <div key={l.label} className="flex items-center gap-2 text-xs font-medium text-[#3d1f2c]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  )
}
