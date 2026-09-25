import type { ReactNode } from "react"

type StatusCardProps = {
  value: string | number
  label: string
  tone: "mint" | "pink" | "sky"
  icon?: ReactNode
  hint?: string
}

const tones = {
  mint: {
    wrap: "from-[#f0fdf6] via-white to-white border-[#c6ebd5]",
    value: "text-[#047857]",
    iconBg: "bg-[#d1fae5] text-[#047857]",
    bar: "bg-gradient-to-b from-[#34d399] to-[#059669]",
    ring: "ring-[#a7f3d0]/60",
  },
  pink: {
    wrap: "from-[#fff5f8] via-white to-white border-[#e5a0b4]",
    value: "text-pink",
    iconBg: "bg-[#fce7f3] text-pink",
    bar: "bg-gradient-to-b from-pink to-pink-deep",
    ring: "ring-pink/15",
  },
  sky: {
    wrap: "from-[#f0f9ff] via-white to-white border-[#b6dff7]",
    value: "text-[#0369a1]",
    iconBg: "bg-[#e0f2fe] text-[#0369a1]",
    bar: "bg-gradient-to-b from-[#38bdf8] to-[#0284c7]",
    ring: "ring-sky/20",
  },
}

export function StatusCard({ value, label, tone, icon, hint }: StatusCardProps) {
  const t = tones[tone]
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-[0_2px_8px_rgba(61,31,44,0.03),0_12px_28px_rgba(233,30,99,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(233,30,99,0.1)] ${t.wrap}`}
    >
      <span className={`absolute top-0 left-0 h-full w-[3px] ${t.bar}`} />
      <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/50 blur-2xl" />
      <div className="relative flex items-start justify-between gap-3 pl-1.5">
        <div>
          <p className="text-[11px] font-bold tracking-[0.14em] text-[#9a7382] uppercase">{label}</p>
          <p className={`mt-2 text-[2rem] leading-none font-extrabold tracking-tight tabular-nums ${t.value}`}>
            {value}
          </p>
          {hint ? <p className="mt-2 text-xs font-medium text-[#8a6b78]">{hint}</p> : null}
        </div>
        {icon ? (
          <div className={`rounded-2xl p-3 shadow-sm ring-4 ring-white/80 ${t.iconBg} ${t.ring}`}>{icon}</div>
        ) : null}
      </div>
    </div>
  )
}

type Severity = "high" | "medium" | "low"

export function SeverityBadge({ severity }: { severity: Severity }) {
  const map = {
    high: "bg-[#fff0f5] text-pink ring-1 ring-[#e5a0b4]",
    medium: "bg-[#fffbeb] text-[#d97706] ring-1 ring-[#fcd34d]",
    low: "bg-[#ecfdf5] text-[#059669] ring-1 ring-[#6ee7b7]",
  } as const
  const label = { high: "High", medium: "Medium", low: "Low" } as const
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase ${map[severity]}`}>
      {label[severity]}
    </span>
  )
}

export function Panel({
  title,
  action,
  children,
  className = "",
  flush = false,
}: {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  flush?: boolean
}) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-[#e5a0b4] bg-white shadow-[0_2px_8px_rgba(61,31,44,0.03),0_14px_36px_rgba(233,30,99,0.06)] ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-[#e5a0b4]/70 bg-gradient-to-r from-[#fffafb] to-white px-5 py-3.5">
          {title ? (
            <div className="flex items-center gap-2.5">
              <span className="h-5 w-1.5 rounded-full bg-gradient-to-b from-pink to-pink-deep" />
              <h2 className="text-[14px] font-bold tracking-tight text-[#3d1f2c]">{title}</h2>
            </div>
          ) : (
            <span />
          )}
          {action}
        </div>
      )}
      <div className={flush ? "" : "p-5"}>{children}</div>
    </section>
  )
}
