import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Download } from "lucide-react"
import { insights, reportByTime, reportByType } from "../data/mock"
import { Panel, StatusCard } from "../components/ui"

export function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Reports & Insights</h1>
          <p className="mt-1 text-sm text-muted">Safety trends across your protection network.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-navy">
            Sep 2026
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-sky-deep px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky/30 hover:opacity-95">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatusCard value={32} label="Total Alerts" tone="pink" />
        <StatusCard value={28} label="Verified & Resolved" tone="sky" />
        <StatusCard value={4} label="Escalated" tone="mint" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Alerts by Type">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportByType}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {reportByType.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E8EEF4",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {reportByType.map((d) => (
              <li key={d.name} className="flex items-center gap-2 text-xs text-navy">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                <span className="flex-1 text-muted">{d.name}</span>
                <span className="font-bold">{d.value}%</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Alerts by Time">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportByTime} barSize={28}>
                <XAxis dataKey="slot" tick={{ fontSize: 12, fill: "#6B7C8F" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#6B7C8F" }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(79,195,247,0.08)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #E8EEF4",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="#E91E63" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {insights.map((i) => (
          <div
            key={i.title}
            className="rounded-[16px] border border-border bg-white p-5 shadow-[var(--shadow-soft)]"
          >
            <p className="text-lg font-extrabold text-pink">{i.title}</p>
            <p className="mt-1 text-sm text-muted">{i.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
