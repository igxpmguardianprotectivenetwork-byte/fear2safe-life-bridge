import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Sparkles,
  CheckCircle2,
} from "lucide-react"
import { useAuth } from "../auth"
import { BootIntro } from "../components/BootIntro"
import { Logo } from "../components/Logo"
import { WorldZoomTransition } from "../components/WorldZoomTransition"

const DEMO_EMAIL = "ahamed@fear2safe.org"
const DEMO_PASS = "LifeBridge2026"

function CinematicBackdrop() {
  return (
    <div className="login-cinema pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Soft video-like photo plate (ken burns) */}
      <div className="login-cinema-plate absolute inset-[-8%]">
        <img
          src="/brand/hero-mother-child.png"
          alt=""
          className="login-cinema-photo h-full w-full object-cover"
          decoding="async"
        />
      </div>

      {/* Color grade overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F33]/88 via-[#1a0a14]/75 to-[#0B1F33]/90" />
      <div className="login-cinema-wash absolute inset-0" />

      {/* Flowing brand ribbons */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="ribPink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E91E63" stopOpacity="0" />
            <stop offset="45%" stopColor="#E91E63" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#4FC3F7" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ribSky" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4FC3F7" stopOpacity="0" />
            <stop offset="50%" stopColor="#29B6F6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#E91E63" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          className="login-ribbon login-ribbon-a"
          d="M-80 520 C 180 380, 320 640, 560 480 S 900 280, 1280 420"
          fill="none"
          stroke="url(#ribPink)"
          strokeWidth="56"
          strokeLinecap="round"
        />
        <path
          className="login-ribbon login-ribbon-b"
          d="M-40 220 C 220 340, 400 80, 640 240 S 980 420, 1280 180"
          fill="none"
          stroke="url(#ribSky)"
          strokeWidth="42"
          strokeLinecap="round"
        />
        <path
          className="login-ribbon login-ribbon-c"
          d="M-60 680 C 260 560, 480 760, 720 600 S 1020 480, 1300 620"
          fill="none"
          stroke="url(#ribPink)"
          strokeWidth="28"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>

      {/* Soft aurora orbs */}
      <div className="login-orb absolute -top-24 -left-20 h-[28rem] w-[28rem] rounded-full bg-pink/35 blur-3xl" />
      <div className="login-orb-delay absolute top-[20%] -right-28 h-[32rem] w-[32rem] rounded-full bg-sky/30 blur-3xl" />
      <div className="login-orb absolute bottom-[-10%] left-[25%] h-80 w-80 rounded-full bg-pink/25 blur-3xl" />
      <div className="login-orb-delay absolute top-[55%] left-[8%] h-56 w-56 rounded-full bg-[#22C55E]/15 blur-3xl" />

      {/* Light sweep like a camera move */}
      <div className="login-light-sweep absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Floating dust / spark particles */}
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={i}
          className="login-particle absolute rounded-full bg-white"
          style={{
            left: `${4 + ((i * 13) % 92)}%`,
            top: `${6 + ((i * 19) % 88)}%`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            animationDelay: `${i * 0.28}s`,
            animationDuration: `${5 + (i % 6)}s`,
            opacity: 0.45,
            boxShadow: i % 2 === 0 ? "0 0 8px rgba(233,30,99,0.8)" : "0 0 8px rgba(79,195,247,0.8)",
          }}
        />
      ))}

      {/* Film grain / vignette for video feel */}
      <div className="login-cinema-grain absolute inset-0 opacity-[0.12]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,12,22,0.75)_100%)]" />
    </div>
  )
}

export function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [introDone, setIntroDone] = useState(false)
  const [panelReady, setPanelReady] = useState(false)
  const [worldZoom, setWorldZoom] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(true)
  const [focused, setFocused] = useState<"email" | "password" | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [shake, setShake] = useState(false)

  const finishIntro = useCallback(() => {
    setIntroDone(true)
    window.requestAnimationFrame(() => setPanelReady(true))
  }, [])

  const strength = useMemo(() => {
    if (!password) return 0
    let s = 0
    if (password.length >= 6) s++
    if (password.length >= 10) s++
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) s++
    if (/[^A-Za-z0-9]/.test(password)) s++
    return Math.min(4, s)
  }, [password])

  useEffect(() => {
    const saved = localStorage.getItem("f2s_remember")
    if (saved) setEmail(saved)
  }, [])

  const fillDemo = () => {
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASS)
    setError("")
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password to open the dashboard.")
      setShake(true)
      window.setTimeout(() => setShake(false), 500)
      return
    }

    if (!email.includes("@")) {
      setError("Please use a valid email address.")
      setShake(true)
      window.setTimeout(() => setShake(false), 500)
      return
    }

    setLoading(true)
    window.setTimeout(() => {
      if (remember) localStorage.setItem("f2s_remember", email)
      else localStorage.removeItem("f2s_remember")
      login()
      setLoading(false)
      setSuccess(true)
      window.setTimeout(() => setWorldZoom(true), 500)
    }, 1100)
  }

  const enterHome = useCallback(() => {
    navigate("/home")
  }, [navigate])

  return (
    <div className="login-page relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070e18] px-4 py-10">
      {!introDone && <BootIntro onDone={finishIntro} />}
      {worldZoom && <WorldZoomTransition onComplete={enterHome} />}

      <CinematicBackdrop />

      <div
        className={`relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-pink/30 bg-white/5 shadow-[0_0_0_1px_rgba(233,30,99,0.2),0_0_60px_rgba(233,30,99,0.25),0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-700 ease-out lg:grid-cols-2 ${
          panelReady && !worldZoom
            ? "translate-y-0 scale-100 opacity-100"
            : worldZoom
              ? "translate-y-4 scale-95 opacity-0"
              : "translate-y-6 scale-[0.96] opacity-0"
        }`}
      >
        {/* Brand side */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-navy via-[#152a40] to-[#2a0f22] p-10 text-white lg:flex">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-10 right-8 h-40 w-40 rounded-full bg-pink/25 blur-3xl" />
            <div className="absolute bottom-16 left-6 h-48 w-48 rounded-full bg-sky/20 blur-3xl" />
          </div>

          <div className="relative">
            <Logo glow toHome={false} className="!h-20 !w-20" />
            <p className="mt-6 text-[11px] font-bold tracking-[0.22em] text-pink uppercase">
              IGXPM
            </p>
            <h1 className="mt-2 text-3xl leading-tight font-extrabold">
              IGXPM
              <span className="text-pink"> Dashboard</span>
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
              Sign in to your intelligent protection ecosystem — guardians, live map, devices, and
              rapid response in one calm bridge.
            </p>
          </div>

          <div className="relative mt-10">
            <div className="login-hero-frame mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-full">
              <img
                src="/brand/igxpm-logo.png"
                alt="IGXPM Guardian Protective Network"
                className="login-hero-img h-full w-full"
                decoding="sync"
                fetchPriority="high"
              />
            </div>
          </div>

          <ul className="relative mt-8 space-y-2.5 text-sm text-white/80">
            {[
              "Live protection map & alerts",
              "Guardian network always ready",
              "Wearable SOS in one tap",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-pink" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Form side */}
        <div className="relative bg-gradient-to-b from-[#FFF8FA] via-white to-[#F0F9FF] p-7 sm:p-10">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Logo glow toHome={false} compact />
            <div>
              <p className="text-xs font-bold tracking-wide text-pink uppercase">IGXPM</p>
              <p className="text-sm font-extrabold text-navy">Dashboard Login</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-pink-soft px-3 py-1 text-[11px] font-bold tracking-wider text-pink uppercase">
              <Sparkles className="h-3.5 w-3.5" /> Secure access
            </div>
            <h2 className="text-2xl font-extrabold text-navy sm:text-[1.75rem]">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              Enter your credentials to open the IGXPM Dashboard.
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className={`space-y-4 transition ${shake ? "login-shake" : ""} ${success ? "scale-[0.98] opacity-70" : ""}`}
          >
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold tracking-wide text-navy/70 uppercase">
                Email
              </span>
              <div
                className={`flex items-center gap-2 rounded-2xl border bg-white px-3.5 py-3 transition ${
                  focused === "email"
                    ? "border-pink shadow-[0_0_0_3px_rgba(233,30,99,0.15),0_0_24px_rgba(233,30,99,0.25)]"
                    : "border-pink/25 shadow-[0_0_16px_rgba(233,30,99,0.08)]"
                }`}
              >
                <Mail className={`h-4 w-4 ${focused === "email" ? "text-pink" : "text-muted"}`} />
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm text-navy outline-none placeholder:text-muted/60"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold tracking-wide text-navy/70 uppercase">
                Password
              </span>
              <div
                className={`flex items-center gap-2 rounded-2xl border bg-white px-3.5 py-3 transition ${
                  focused === "password"
                    ? "border-pink shadow-[0_0_0_3px_rgba(233,30,99,0.15),0_0_24px_rgba(233,30,99,0.25)]"
                    : "border-pink/25 shadow-[0_0_16px_rgba(233,30,99,0.08)]"
                }`}
              >
                <Lock className={`h-4 w-4 ${focused === "password" ? "text-pink" : "text-muted"}`} />
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-sm text-navy outline-none placeholder:text-muted/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="rounded-lg p-1 text-muted transition hover:bg-pink-soft hover:text-pink"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password ? (
                <div className="mt-2 flex gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={`h-1 flex-1 rounded-full transition ${
                        i < strength
                          ? strength <= 1
                            ? "bg-orange"
                            : strength === 2
                              ? "bg-sky-deep"
                              : "bg-pink"
                          : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              ) : null}
            </label>

            <div className="flex items-center justify-between gap-3 pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-navy/80">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-pink/40 accent-pink"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-sm font-semibold text-pink hover:underline"
                onClick={() => setError("Demo mode: use the Fill demo button below.")}
              >
                Forgot password?
              </button>
            </div>

            {error ? (
              <p className="rounded-xl border border-pink/30 bg-pink-soft px-3 py-2 text-sm font-medium text-pink">
                {error}
              </p>
            ) : null}

            {success ? (
              <p className="flex items-center justify-center gap-2 rounded-xl bg-mint-soft px-3 py-2 text-sm font-semibold text-mint">
                <CheckCircle2 className="h-4 w-4" /> Opening Life Bridge…
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading || success}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-pink to-pink-deep px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(233,30,99,0.4)] transition hover:scale-[1.02] hover:shadow-[0_14px_36px_rgba(233,30,99,0.5)] active:scale-[0.98] disabled:cursor-wait disabled:opacity-80"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition group-hover:translate-x-full group-hover:duration-700" />
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in…
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  Enter IGXPM Dashboard
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={fillDemo}
            className="mt-4 w-full rounded-2xl border border-dashed border-pink/40 bg-pink-soft/50 py-2.5 text-sm font-semibold text-pink transition hover:bg-pink-soft"
          >
            Fill demo credentials
          </button>

          <p className="mt-6 text-center text-xs text-muted">
            Protected access for guardians & operators. Refresh anytime to return to login.
          </p>
        </div>
      </div>
    </div>
  )
}
