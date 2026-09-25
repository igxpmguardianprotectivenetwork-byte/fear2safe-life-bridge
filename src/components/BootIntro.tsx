import { useEffect, useMemo, useState } from "react"
import { Heart, Shield, Sparkles, Users } from "lucide-react"

type BootIntroProps = {
  onDone: () => void
}

const STATUS = [
  "Waking the guardians…",
  "Building the Life Bridge…",
  "Lighting the safe path…",
  "Wrapping you in care…",
  "Almost home — stay close.",
]

export function BootIntro({ onDone }: BootIntroProps) {
  const [phase, setPhase] = useState<"boot" | "brand" | "exit">("boot")
  const [progress, setProgress] = useState(0)
  const [statusIdx, setStatusIdx] = useState(0)

  useEffect(() => {
    const timeouts: number[] = []
    timeouts.push(window.setTimeout(() => setPhase("brand"), 700))

    const start = performance.now()
    const duration = 5000
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setProgress(t)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const statusTimer = window.setInterval(() => {
      setStatusIdx((i) => (i + 1) % STATUS.length)
    }, 900)

    timeouts.push(window.setTimeout(() => setPhase("exit"), 5000))
    timeouts.push(window.setTimeout(() => onDone(), 5500))

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id))
      window.clearInterval(statusTimer)
      cancelAnimationFrame(raf)
    }
  }, [onDone])

  const skip = () => {
    setPhase("exit")
    window.setTimeout(onDone, 450)
  }

  const bridgeLit = useMemo(() => Math.max(0.08, progress), [progress])
  const step = Math.min(4, Math.floor(progress * 5))

  return (
    <div
      className={`boot-intro fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#050b14] ${
        phase === "exit" ? "boot-intro-exit" : ""
      }`}
      onClick={skip}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") skip()
      }}
      role="button"
      tabIndex={0}
      aria-label="Fear2Safe startup. Click to continue."
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="boot-glow absolute top-1/2 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink/20 blur-3xl" />
        <div className="boot-glow-2 absolute top-1/2 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky/15 blur-3xl" />
      </div>

      {Array.from({ length: 16 }).map((_, i) => (
        <span
          key={i}
          className="boot-spark pointer-events-none absolute h-1 w-1 rounded-full bg-pink"
          style={{
            left: `${10 + ((i * 17) % 80)}%`,
            bottom: `${8 + (i % 5) * 6}%`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}

      <div
        className={`relative flex flex-col items-center transition duration-700 ${
          phase === "boot" ? "scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <div className="relative mb-8 flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48">
          <span className="boot-ring absolute inset-0 rounded-full border border-pink/40" />
          <span className="boot-ring boot-ring-delay absolute inset-[-12px] rounded-full border border-sky/30" />
          <span className="boot-ring boot-ring-delay-2 absolute inset-[-24px] rounded-full border border-pink/20" />

          <div className="boot-logo-wrap relative z-10 h-[7.5rem] w-[7.5rem] overflow-hidden rounded-full shadow-[0_0_40px_rgba(233,30,99,0.55)] ring-2 ring-pink/60 sm:h-36 sm:w-36">
            <img
              src="/brand/fear2safe-logo.jpg"
              alt="Fear2Safe"
              className="h-full w-full object-cover"
              decoding="sync"
              fetchPriority="high"
            />
          </div>
        </div>

        <p className="boot-fade-item text-[11px] font-bold tracking-[0.35em] text-pink uppercase">
          Life Bridge
        </p>
        <h1 className="boot-fade-item boot-fade-delay mt-2 text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Fear<span className="text-pink">2</span>Safe
        </h1>
        <p className="boot-fade-item boot-fade-delay-2 mt-3 max-w-xs text-center text-sm text-white/65">
          An Intelligent Integrated Protection Ecosystem
          <br />
          for Women and Children
        </p>

        {/* Creative Life Bridge loader */}
        <div className="boot-fade-item boot-fade-delay-3 mt-10 w-[min(100%,20rem)] px-2">
          <div className="relative mx-auto h-24">
            <svg viewBox="0 0 320 96" className="h-full w-full overflow-visible" aria-hidden>
              <defs>
                <linearGradient id="bridgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E91E63" />
                  <stop offset="50%" stopColor="#4FC3F7" />
                  <stop offset="100%" stopColor="#22C55E" />
                </linearGradient>
                <filter id="bridgeGlow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Dim bridge path */}
              <path
                d="M36 58 C 90 18, 230 18, 284 58"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Lit bridge path */}
              <path
                d="M36 58 C 90 18, 230 18, 284 58"
                fill="none"
                stroke="url(#bridgeGrad)"
                strokeWidth="4.5"
                strokeLinecap="round"
                filter="url(#bridgeGlow)"
                style={{
                  strokeDasharray: 320,
                  strokeDashoffset: 320 - bridgeLit * 320,
                  transition: "stroke-dashoffset 80ms linear",
                }}
              />

              {/* Traveling light bead */}
              <circle r="6" fill="#fff" filter="url(#bridgeGlow)" className="boot-bridge-bead">
                <animateMotion dur="1.8s" repeatCount="indefinite" path="M36 58 C 90 18, 230 18, 284 58" />
              </circle>

              {/* Left node — heart / care */}
              <circle cx="36" cy="58" r="16" fill="#1a0a14" stroke="#E91E63" strokeWidth="2" />
              <circle
                cx="36"
                cy="58"
                r="16"
                fill="none"
                stroke="#E91E63"
                strokeWidth="2"
                className="boot-node-pulse"
                opacity={step >= 0 ? 1 : 0.3}
              />

              {/* Right node — safe / shield */}
              <circle cx="284" cy="58" r="16" fill="#0B1F33" stroke="#22C55E" strokeWidth="2" />
              <circle
                cx="284"
                cy="58"
                r="16"
                fill="none"
                stroke="#22C55E"
                strokeWidth="2"
                className="boot-node-pulse"
                style={{ animationDelay: "0.4s" }}
                opacity={step >= 3 ? 1 : 0.35}
              />
            </svg>

            <div className="pointer-events-none absolute top-[42%] left-[4%] flex h-8 w-8 -translate-y-1/2 items-center justify-center text-pink">
              <Heart className="h-3.5 w-3.5 fill-pink" />
            </div>
            <div className="pointer-events-none absolute top-[42%] right-[4%] flex h-8 w-8 -translate-y-1/2 items-center justify-center text-mint">
              <Shield className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Stepping care icons */}
          <div className="mt-1 flex items-center justify-center gap-3">
            {[
              { icon: Heart, label: "Care" },
              { icon: Users, label: "Connect" },
              { icon: Sparkles, label: "Protect" },
              { icon: Shield, label: "Safe" },
            ].map((item, i) => {
              const Icon = item.icon
              const on = step >= i
              return (
                <div
                  key={item.label}
                  className={`flex flex-col items-center gap-1 transition duration-500 ${
                    on ? "scale-110 opacity-100" : "scale-90 opacity-30"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                      on
                        ? "border-pink/50 bg-pink/20 text-pink shadow-[0_0_16px_rgba(233,30,99,0.45)]"
                        : "border-white/10 bg-white/5 text-white/40"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[9px] font-semibold tracking-wide text-white/50 uppercase">
                    {item.label}
                  </span>
                </div>
              )
            })}
          </div>

          <p
            key={statusIdx}
            className="boot-status-line mt-5 text-center text-[12px] font-medium tracking-wide text-white/60"
          >
            {STATUS[statusIdx]}
          </p>
        </div>

        <p className="boot-fade-item boot-fade-delay-3 mt-7 text-[11px] tracking-wide text-white/35">
          Tap anywhere to continue
        </p>
      </div>
    </div>
  )
}
