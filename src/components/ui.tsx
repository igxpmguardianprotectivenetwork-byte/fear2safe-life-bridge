import type { ReactNode } from "react"

type StatusCardProps = {
  value: string | number
  label: string
  tone: "mint" | "pink" | "sky"
  icon?: ReactNode
  hint?: string
}

/** mint = healthy · pink = critical/attention · sky = warning/verify */
const tones = {
  mint: {
    wrap: "from-[#ECFDF5] to-white border-[#BBF7D0]",
    value: "text-[#16A34A]",
    iconBg: "bg-[#ECFDF5] text-[#22C55E]",
    bar: "bg-[#22C55E]",
    glow: "shadow-[0_0_20px_rgba(34,197,94,0.18)]",
  },
  pink: {
    wrap: "from-[#FFF1F2] to-white border-[#FECDD3]",
    value: "text-[#E11D48]",
    iconBg: "bg-[#FFF1F2] text-[#FF4D5A]",
    bar: "bg-[#FF4D5A]",
    glow: "shadow-[0_0_20px_rgba(255,77,90,0.2)]",
  },
  sky: {
    wrap: "from-[#FFF8E8] to-white border-[#FDE68A]",
    value: "text-[#D97706]",
    iconBg: "bg-[#FFF8E8] text-[#F6B73C]",
    bar: "bg-[#F6B73C]",
    glow: "shadow-[0_0_20px_rgba(246,183,60,0.2)]",
  },
}

export function StatusCard({ value, label, tone, icon, hint }: StatusCardProps) {
  const t = tones[tone]
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-[0_1px_2px_rgba(16,42,67,0.04)] ${t.wrap} ${t.glow}`}
    >
      <span className={`absolute top-0 left-0 h-full w-1 ${t.bar}`} />
      <div className="flex items-start justify-between gap-3 pl-1">
        <div>
          <p className="text-[11px] font-bold tracking-[0.12em] text-[#486174] uppercase">{label}</p>
          <p className={`mt-1.5 text-3xl font-extrabold tracking-tight tabular-nums ${t.value}`}>{value}</p>
          {hint ? <p className="mt-1 text-xs font-medium text-[#486174]">{hint}</p> : null}
        </div>
        {icon ? <div className={`rounded-xl p-2.5 ${t.iconBg}`}>{icon}</div> : null}
      </div>
    </div>
  )
}

type Severity = "high" | "medium" | "low"

export function SeverityBadge({ severity }: { severity: Severity }) {
  const map = {
    high: "bg-[#FFF1F2] text-[#FF4D5A] ring-1 ring-[#FECDD3] shadow-[0_0_12px_rgba(255,77,90,0.25)]",
    medium: "bg-[#FFF8E8] text-[#D97706] ring-1 ring-[#FDE68A] shadow-[0_0_12px_rgba(246,183,60,0.25)]",
    low: "bg-[#ECFDF5] text-[#22C55E] ring-1 ring-[#BBF7D0] shadow-[0_0_12px_rgba(34,197,94,0.2)]",
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
      className={`overflow-hidden rounded-2xl border border-[#DCE6EE] bg-white shadow-[0_1px_2px_rgba(16,42,67,0.04),0_10px_28px_rgba(16,42,67,0.05)] ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-[#DCE6EE] bg-[#F5F9FC]/80 px-5 py-3.5">
          {title ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-[#007F86] shadow-[0_0_8px_rgba(0,127,134,0.55)]" />
              <h2 className="text-[14px] font-bold text-[#102A43]">{title}</h2>
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
