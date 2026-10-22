import { useEffect, useRef, useState, type MouseEvent } from "react"
import { Link } from "react-router-dom"
import {
  Eye,
  HeartHandshake,
  Play,
  Shield,
  Sparkles,
  Zap,
  Bus,
  FileWarning,
  Baby,
  ArrowRight,
  X,
} from "lucide-react"
import { Logo } from "../components/Logo"
import { igxpmLogoUrl } from "../lib/brand"

const features = [
  {
    title: "Detect Early",
    desc: "Sensors and AI spot risk before it escalates.",
    icon: Eye,
    bg: "bg-[#E3F2FD]",
    color: "text-[#1E88E5]",
  },
  {
    title: "Connect & Protect",
    desc: "Guardians and responders stay one tap away.",
    icon: HeartHandshake,
    bg: "bg-pink-soft",
    color: "text-pink",
  },
  {
    title: "Respond Faster",
    desc: "Live location and clear actions cut delay.",
    icon: Zap,
    bg: "bg-[#F3E5F5]",
    color: "text-[#8E24AA]",
  },
  {
    title: "Brighter Tomorrows",
    desc: "Safety that restores dignity and freedom.",
    icon: Sparkles,
    bg: "bg-mint-soft",
    color: "text-mint",
  },
]

const stats = [
  { icon: Bus, value: 90, suffix: "%", label: "of women face public transport harassment" },
  { icon: FileWarning, value: 10000, prefix: ">", label: "safety complaints filed every year" },
  { icon: Baby, value: 1, suffix: " Billion", label: "children worldwide at risk of violence" },
]

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#features", label: "Features" },
  { href: "#impact", label: "Impact" },
  { href: "#contact", label: "Contact" },
]

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, visible }
}

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!active) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setN(Math.round(target * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, target, duration])
  return n
}

function HeroArt() {
  const wrap = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = wrap.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setTilt({ x: py * -8, y: px * 10 })
  }

  return (
    <div
      ref={wrap}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="reveal-in relative mx-auto aspect-square w-full max-w-[460px] cursor-pointer"
      style={{ perspective: 900 }}
    >
      {/* Soft ambient glows */}
      <div className="pointer-events-none absolute inset-[4%] animate-pulse rounded-full bg-gradient-to-br from-pink/30 via-sky/25 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -top-4 -right-2 h-28 w-28 rounded-full bg-pink/25 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-2 -left-4 h-24 w-24 rounded-full bg-sky/30 blur-2xl" />

      <div
        className="hero-glow relative h-full w-full transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Refined circular crop + pink glow frame */}
        <div className="hero-image-frame absolute inset-[6%] overflow-hidden rounded-full">
          <img
            src={igxpmLogoUrl}
            alt="IGXPM Guardian Protective Network"
            className="hero-image-refined h-full w-full select-none"
            draggable={false}
            decoding="sync"
            fetchPriority="high"
          />
        </div>
      </div>
    </div>
  )
}

function StatItem({
  icon: Icon,
  value,
  prefix = "",
  suffix = "",
  label,
  active,
  delay,
}: {
  icon: typeof Bus
  value: number
  prefix?: string
  suffix?: string
  label: string
  active: boolean
  delay: number
}) {
  const n = useCountUp(value, active)
  const text = `${prefix}${n.toLocaleString()}${suffix}`

  return (
    <div
      className={`flex gap-4 transition duration-700 ${active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-pink">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-pink tabular-nums">{text}</p>
        <p className="mt-1 text-sm text-white/70">{label}</p>
      </div>
    </div>
  )
}

export function Landing() {
  const [activeNav, setActiveNav] = useState("#home")
  const [storyOpen, setStoryOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const featuresIn = useInView<HTMLElement>(0.15)
  const impactIn = useInView<HTMLElement>(0.25)
  const aboutIn = useInView<HTMLElement>(0.2)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      const ids = navLinks.map((l) => l.href.slice(1))
      let current = "#home"
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= 120) current = `#${id}`
      }
      setActiveNav(current)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="landing-page min-h-screen overflow-x-hidden bg-gradient-to-b from-[#F7FBFF] via-white to-[#FFF5F8]">
      <header
        className={`sticky top-0 z-50 transition duration-300 ${
          scrolled
            ? "border-b border-pink/20 bg-white/85 shadow-[0_8px_30px_rgba(233,30,99,0.08)] backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Logo glow />
          <nav className="hidden items-center gap-1 text-[13.5px] font-medium md:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`rounded-full px-3.5 py-2 transition ${
                  activeNav === l.href
                    ? "bg-pink text-white shadow-md shadow-pink/30"
                    : "text-navy/75 hover:bg-pink-soft hover:text-pink"
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-1.5 rounded-full bg-pink px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink/30 transition hover:scale-[1.03] hover:bg-pink-deep active:scale-95"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </header>

      <section id="home" className="mx-auto grid max-w-6xl items-center gap-10 px-5 pt-6 pb-12 sm:px-8 lg:grid-cols-2 lg:pt-8">
        <div className="reveal-in">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-pink-soft px-3 py-1 text-[11px] font-bold tracking-wider text-pink uppercase">
            <Shield className="h-3.5 w-3.5" /> Intelligent Protection Ecosystem
          </p>
          <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight text-navy sm:text-5xl lg:text-[3.4rem]">
            A Safer Tomorrow,
            <br />
            <span className="bg-gradient-to-r from-pink to-sky-deep bg-clip-text text-transparent">
              Together.
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-[15.5px] leading-relaxed text-muted">
            An Intelligent Integrated Protection Ecosystem for women and children — wearables,
            guardians, and rapid response united so you can detect early, connect instantly, and
            protect with dignity.
          </p>

          <blockquote className="relative mt-6 pl-8">
            <span className="absolute top-0 left-0 text-4xl leading-none font-serif text-pink">“</span>
            <p className="text-[15px] text-navy/80 italic">
              The danger has started. The protection should too.
            </p>
          </blockquote>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 rounded-full bg-pink px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-pink/35 transition hover:scale-[1.03] hover:bg-pink-deep active:scale-95"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <button
              type="button"
              onClick={() => setStoryOpen(true)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-navy transition hover:text-pink"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white shadow-sm transition group-hover:scale-105">
                <Play className="h-4 w-4 fill-navy" />
              </span>
              Watch Our Story
            </button>
          </div>
        </div>

        <HeroArt />
      </section>

      <section
        id="about"
        ref={aboutIn.ref}
        className={`mx-auto max-w-6xl px-5 pb-10 sm:px-8 transition duration-700 ${
          aboutIn.visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="rounded-[20px] border border-border bg-white/80 p-6 shadow-[var(--shadow-soft)] backdrop-blur sm:p-8">
          <h2 className="text-xl font-extrabold text-navy sm:text-2xl">About Life Bridge</h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted">
            Fear2Safe Life Bridge connects wearable signals, trusted guardians, and rapid responders
            into one calm safety layer. When risk appears, the right people see it — with location,
            context, and clear next steps — so every woman and child can move through the world with
            dignity.
          </p>
        </div>
      </section>

      <section id="features" ref={featuresIn.ref} className="mx-auto max-w-6xl px-5 pb-14 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <button
                key={f.title}
                type="button"
                className={`group rounded-[16px] border border-border bg-white p-5 text-left shadow-[var(--shadow-soft)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(233,30,99,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-pink ${
                  featuresIn.visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full transition duration-300 group-hover:scale-110 ${f.bg} ${f.color}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="text-[15px] font-bold text-navy">{f.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{f.desc}</p>
              </button>
            )
          })}
        </div>
      </section>

      <section id="impact" ref={impactIn.ref} className="border-t border-border bg-navy text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3 sm:px-8">
          {stats.map((s, i) => (
            <StatItem key={s.label} {...s} active={impactIn.visible} delay={i * 120} />
          ))}
        </div>
      </section>

      <div className="bg-gradient-to-r from-pink-soft via-white to-sky-soft py-8 text-center">
        <p className="text-lg font-extrabold tracking-tight text-navy sm:text-xl">
          Because She Matters. Because They Matter.
        </p>
      </div>

      <footer id="contact" className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-muted sm:flex-row sm:px-8">
          <Logo />
          <p>© 2026 Fear2Safe Life Bridge. Built for safer communities.</p>
          <a href="mailto:hello@fear2safe.org" className="font-medium text-pink hover:underline">
            hello@fear2safe.org
          </a>
        </div>
      </footer>

      {storyOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/55 p-4 backdrop-blur-sm"
          onClick={() => setStoryOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Our story"
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-[20px] border border-pink/30 bg-white p-6 shadow-[0_0_40px_rgba(233,30,99,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-3 right-3 rounded-full p-2 text-muted hover:bg-pink-soft hover:text-pink"
              onClick={() => setStoryOpen(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mx-auto mb-4 h-44 w-44 overflow-hidden rounded-full shadow-[0_0_24px_rgba(233,30,99,0.35)]">
              <img
                src={igxpmLogoUrl}
                alt="IGXPM"
                className="hero-image-refined h-full w-full"
                decoding="sync"
              />
            </div>
            <h3 className="text-center text-xl font-extrabold text-navy">Our Story</h3>
            <p className="mt-3 text-center text-sm leading-relaxed text-muted">
              Fear2Safe began with a simple belief: protection should arrive before fear takes hold.
              Life Bridge is how families, guardians, and communities stay connected — every woman,
              every child, every moment.
            </p>
            <Link
              to="/dashboard"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-pink py-3 text-sm font-bold text-white hover:bg-pink-deep"
              onClick={() => setStoryOpen(false)}
            >
              Enter the Bridge <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
