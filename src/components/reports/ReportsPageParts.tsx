import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  BarChart3,
  BellRing,
  Bus,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  Download,
  MapPin,
  Network,
  PieChart as PieChartIcon,
  ShieldCheck,
  Smartphone,
  TriangleAlert,
  TrendingUp,
  Users,
  Wifi,
} from "lucide-react"
import {
  deviceHealth,
  deviceHealthSlices,
  insights,
  reportByTime,
  reportByType,
  reportKpis,
  reportSummary,
  riskTrend,
  triggerZones,
} from "../../data/reports"

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const chart = data.map((v, i) => ({ i, v }))
  return (
    <div className="f2s-rpt-spark" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chart} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.8}
            fill={`url(#spark-${color.replace("#", "")})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

const toneMeta = {
  pink: { color: "#F21863", bg: "#FFF0F5", icon: BellRing },
  green: { color: "#16B981", bg: "#EAF9F3", icon: ShieldCheck },
  orange: { color: "#FF9800", bg: "#FFF5E8", icon: TriangleAlert },
  blue: { color: "#159FE8", bg: "#E8F6FD", icon: Clock3 },
  purple: { color: "#7B52F5", bg: "#F1ECFF", icon: Smartphone },
}

export function ReportsHeader({ onExport }: { onExport: () => void }) {
  return (
    <header className="f2s-rpt-header">
      <div>
        <div className="f2s-rpt-title-row">
          <span className="f2s-rpt-title-icon" aria-hidden>
            <BarChart3 />
          </span>
          <h1>Reports & Insights</h1>
        </div>
        <p className="f2s-rpt-subtitle">Safety trends across your protection network.</p>
        <p className="f2s-rpt-fresh">
          <span className="f2s-rpt-dot" />
          Last updated {reportSummary.lastUpdated}
        </p>
      </div>
      <div className="f2s-rpt-controls">
        <button type="button" className="f2s-rpt-select" aria-label="Change report view">
          <Network />
          View: Network Overview
          <ChevronDown />
        </button>
        <button type="button" className="f2s-rpt-select" aria-label="Change date range">
          <CalendarDays />
          Sep 2026
          <ChevronDown />
        </button>
        <button type="button" className="f2s-rpt-export" onClick={onExport} aria-label="Export report">
          <Download />
          Export
        </button>
      </div>
    </header>
  )
}

export function KpiGrid() {
  return (
    <section className="f2s-rpt-kpi-grid" aria-label="Summary metrics">
      {reportKpis.map((k) => {
        const meta = toneMeta[k.tone]
        const Icon = meta.icon
        return (
          <article key={k.id} className={`f2s-rpt-kpi f2s-rpt-kpi-${k.tone}`}>
            <div className="f2s-rpt-kpi-top">
              <span className="f2s-rpt-kpi-icon" style={{ background: meta.bg, color: meta.color }}>
                <Icon />
              </span>
              <MiniSparkline data={k.spark} color={meta.color} />
            </div>
            <p className="f2s-rpt-kpi-label">{k.label}</p>
            <p className="f2s-rpt-kpi-value">
              {k.value}
              {"unit" in k && k.unit ? <small>{k.unit}</small> : null}
            </p>
            <p className={`f2s-rpt-kpi-trend ${k.trendPositive ? "pos" : "neg"}`}>
              {k.trendUp ? "↑" : "↓"} {k.trend.replace(/^[+-]/, "")}{" "}
              <span>{k.hint}</span>
            </p>
          </article>
        )
      })}
    </section>
  )
}

export function AlertsByTypeCard() {
  const total = reportByType.reduce((s, d) => s + d.count, 0)
  return (
    <section className="f2s-rpt-card">
      <div className="f2s-rpt-card-head">
        <div>
          <div className="f2s-rpt-card-title">
            <PieChartIcon />
            <h2>Alerts by Type</h2>
          </div>
          <p>Distribution of alerts across different safety risk types.</p>
        </div>
        <button type="button" className="f2s-rpt-mini-select">
          All Devices <ChevronDown />
        </button>
      </div>
      <div className="f2s-rpt-type-body">
        <div className="f2s-rpt-donut">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={reportByType}
                dataKey="count"
                nameKey="name"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={2}
                stroke="#fff"
                strokeWidth={2}
              >
                {reportByType.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => {
                  const row = reportByType.find((d) => d.name === name)
                  return [`${value} (${row?.value ?? 0}%)`, name]
                }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #DCEAF4",
                  fontSize: 12,
                  boxShadow: "0 6px 18px rgba(31,76,108,0.08)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="f2s-rpt-donut-center">
            <strong>{total}</strong>
            <span>Total Alerts</span>
          </div>
        </div>
        <div className="f2s-rpt-type-list" role="table" aria-label="Alert type breakdown">
          <div className="f2s-rpt-type-head" role="row">
            <span>Type</span>
            <span>%</span>
            <span>Count</span>
          </div>
          {reportByType.map((d) => (
            <div key={d.name} className="f2s-rpt-type-row" role="row">
              <span className="f2s-rpt-type-name">
                <i style={{ background: d.color }} />
                {d.name}
              </span>
              <span>{d.value}%</span>
              <strong>{d.count}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AlertsByTimeCard() {
  return (
    <section className="f2s-rpt-card">
      <div className="f2s-rpt-card-head">
        <div>
          <div className="f2s-rpt-card-title">
            <BarChart3 />
            <h2>Alerts by Time</h2>
          </div>
          <p>Number of alerts triggered across time intervals.</p>
        </div>
        <button type="button" className="f2s-rpt-mini-select">
          Sep 2026 <ChevronDown />
        </button>
      </div>
      <div className="f2s-rpt-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={reportByTime} barSize={36} margin={{ top: 22, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#E8F1F7" strokeDasharray="3 3" />
            <XAxis dataKey="slot" tick={{ fontSize: 12, fill: "#6E829A" }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: "#6E829A" }}
              axisLine={false}
              tickLine={false}
              label={{ value: "Number of Alerts", angle: -90, position: "insideLeft", offset: 12, style: { fill: "#6E829A", fontSize: 11 } }}
            />
            <Tooltip
              cursor={{ fill: "rgba(242,24,99,0.06)" }}
              contentStyle={{ borderRadius: 12, border: "1px solid #DCEAF4", fontSize: 12 }}
            />
            <Bar dataKey="count" name="Alerts" radius={[8, 8, 4, 4]} fill="url(#f2sBarPink)">
              <LabelList dataKey="count" position="top" style={{ fill: "#102A4A", fontSize: 12, fontWeight: 700 }} />
            </Bar>
            <defs>
              <linearGradient id="f2sBarPink" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF4D7A" />
                <stop offset="100%" stopColor="#F21863" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export function ProtectionRiskTrend() {
  return (
    <section className="f2s-rpt-card">
      <div className="f2s-rpt-card-head">
        <div>
          <div className="f2s-rpt-card-title">
            <TrendingUp />
            <h2>Protection Risk Trend</h2>
          </div>
          <p>Total alerts and resolved cases over the last 30 days.</p>
        </div>
        <button type="button" className="f2s-rpt-mini-select">
          Last 30 Days <ChevronDown />
        </button>
      </div>
      <div className="f2s-rpt-legend">
        <span>
          <i style={{ background: "#F21863" }} /> Alerts
        </span>
        <span>
          <i style={{ background: "#159FE8" }} /> Resolved
        </span>
      </div>
      <div className="f2s-rpt-chart f2s-rpt-chart-sm">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={riskTrend} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid stroke="#E8F1F7" strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6E829A" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 12]} tick={{ fontSize: 11, fill: "#6E829A" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #DCEAF4", fontSize: 12 }} />
            <defs>
              <linearGradient id="f2sAlertFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F21863" stopOpacity={0.16} />
                <stop offset="100%" stopColor="#F21863" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="f2sResolvedFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#159FE8" stopOpacity={0.14} />
                <stop offset="100%" stopColor="#159FE8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="alerts" stroke="none" fill="url(#f2sAlertFill)" />
            <Area type="monotone" dataKey="resolved" stroke="none" fill="url(#f2sResolvedFill)" />
            <Line type="monotone" dataKey="alerts" name="Alerts" stroke="#F21863" strokeWidth={2.4} dot={{ r: 3.5, fill: "#F21863", strokeWidth: 0 }} />
            <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#159FE8" strokeWidth={2.4} dot={{ r: 3.5, fill: "#159FE8", strokeWidth: 0 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export function TopTriggerZones() {
  return (
    <section className="f2s-rpt-card">
      <div className="f2s-rpt-card-head">
        <div>
          <div className="f2s-rpt-card-title">
            <MapPin />
            <h2>Top Trigger Zones</h2>
          </div>
          <p>Locations with the highest number of alerts.</p>
        </div>
        <button type="button" className="f2s-rpt-mini-select">
          All Zones <ChevronDown />
        </button>
      </div>
      <ul className="f2s-rpt-zones">
        {triggerZones.map((z) => (
          <li key={z.name}>
            <span className="f2s-rpt-rank">{z.rank}</span>
            <div className="f2s-rpt-zone-main">
              <div className="f2s-rpt-zone-top">
                <strong>{z.name}</strong>
                <em>{z.alerts}</em>
              </div>
              <div className="f2s-rpt-zone-bar">
                <span style={{ width: `${z.pct}%`, background: z.color }} />
              </div>
            </div>
            <span className={`f2s-rpt-zone-trend ${z.up ? "up" : "down"}`}>{z.trend}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function DeviceHealthStatus() {
  return (
    <section className="f2s-rpt-card">
      <div className="f2s-rpt-card-head">
        <div>
          <div className="f2s-rpt-card-title">
            <Smartphone />
            <h2>Device Health Status</h2>
          </div>
          <p>Real-time status of all connected devices.</p>
        </div>
        <button type="button" className="f2s-rpt-mini-select">
          All Devices <ChevronDown />
        </button>
      </div>
      <div className="f2s-rpt-health">
        <div className="f2s-rpt-donut f2s-rpt-donut-sm">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deviceHealthSlices}
                dataKey="value"
                nameKey="name"
                innerRadius={48}
                outerRadius={68}
                paddingAngle={2}
                stroke="#fff"
                strokeWidth={2}
              >
                {deviceHealthSlices.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #DCEAF4", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="f2s-rpt-donut-center">
            <strong>{deviceHealth.total}</strong>
            <span>Devices</span>
          </div>
        </div>
        <ul className="f2s-rpt-health-list">
          {deviceHealthSlices.map((d) => (
            <li key={d.name}>
              <span>
                <i style={{ background: d.color }} />
                {d.name}
              </span>
              <strong>
                {d.value} <em>{d.pct}%</em>
              </strong>
            </li>
          ))}
        </ul>
      </div>
      <div className="f2s-rpt-health-strip">
        <Wifi />
        <div>
          <strong>All systems operational</strong>
          <p>
            {deviceHealth.online} of {deviceHealth.total} devices online
          </p>
        </div>
        <ChevronRight />
      </div>
    </section>
  )
}

export function InsightStrip() {
  const icons = {
    pink: MapPin,
    blue: Clock3,
    green: ShieldCheck,
  }
  const sideIcons = {
    pink: Bus,
    blue: Users,
    green: BarChart3,
  }
  return (
    <section className="f2s-rpt-insights" aria-label="Key insights">
      {insights.map((item) => {
        const Icon = icons[item.tone]
        const Side = sideIcons[item.tone]
        return (
          <article key={item.title} className={`f2s-rpt-insight f2s-rpt-insight-${item.tone}`}>
            <span className="f2s-rpt-insight-icon">
              <Icon />
            </span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
              {item.trend ? <em className="f2s-rpt-insight-trend">{item.trend}</em> : null}
            </div>
            <span className="f2s-rpt-insight-side">
              <Side />
            </span>
          </article>
        )
      })}
    </section>
  )
}
