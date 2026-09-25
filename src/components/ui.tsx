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
    wrap: "from-[#ecfdf5] to-white border-[#bbf7d0]",
    value: "text-[#059669]",
    iconBg: "bg-[#d1fae5] text-[#059669]",
    bar: "bg-[#34d399]",
  },
  pink: {
    wrap: "from-[#fff0f5] to-white border-[#f0a8c0]",
    value: "text-pink",
    iconBg: "bg-[#fce7f3] text-pink",
    bar: "bg-pink",
  },
  sky: {
    wrap: "from-[#eff8ff] to-white border-[#bae6fd]",
    value: "text-[#0284c7]",
    iconBg: "bg-[#e0f2fe] text-[#0284c7]",
    bar: "bg-[#38bdf8]",
  },
}

export function StatusCard({ value, label, tone, icon, hint }: StatusCardProps) {
  const t = tones[tone]
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 bg-gradient-to-br p-5 shadow-[0_1px_2px_rgba(61,31,44,0.04),0_8px_24px_rgba(233,30,99,0.05)] ${t.wrap}`}
    >
      <span className={`absolute top-0 left-0 h-full w-1 ${t.bar}`} />
      <div className="flex items-start justify-between gap-3 pl-1">
        <div>
          <p className="text-[11px] font-bold tracking-[0.12em] text-[#8a6b78] uppercase">{label}</p>
          <p className={`mt-1.5 text-3xl font-extrabold tracking-tight tabular-nums ${t.value}`}>{value}</p>
          {hint ? <p className="mt-1 text-xs font-medium text-[#8a6b78]">{hint}</p> : null}
        </div>
        {icon ? <div className={`rounded-xl p-2.5 ${t.iconBg}`}>{icon}</div> : null}
      </div>
    </div>
  )
}

type Severity = "high" | "medium" | "low"

export function SeverityBadge({ severity }: { severity: Severity }) {
  const map = {
    high: "bg-[#fff0f5] text-pink ring-1 ring-[#f0a8c0]",
    medium: "bg-[#fffbeb] text-[#d97706] ring-1 ring-[#fde68a]",
    low: "bg-[#ecfdf5] text-[#059669] ring-1 ring-[#a7f3d0]",
  } as const
  const label = { high: "High", medium: "Medium", low: "Low" } as const
  return (
    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${map[severity]}`}>
      {label[severity]}
    </span>
  )
}

export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border-2 border-[#e5a0b4] bg-white shadow-[0_1px_2px_rgba(61,31,44,0.04),0_10px_28px_rgba(233,30,99,0.05)] ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b-2 border-[#efc2d0] bg-[#fffafb] px-5 py-3.5">
          {title ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-pink" />
              <h2 className="text-[14px] font-bold text-[#3d1f2c]">{title}</h2>
            </div>
          ) : (
            <span />
          )}
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  )
}
