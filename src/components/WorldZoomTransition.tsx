import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Globe, { type GlobeMethods } from "react-globe.gl"
import { Color } from "three"
import { MapPin, Orbit, Sparkles } from "lucide-react"

/** Geographic centre of Sri Lanka — camera target */
const SRI_LANKA = { lat: 7.8731, lng: 80.7718 }

type WorldZoomTransitionProps = {
  onComplete: () => void
}

type Phase = "spin" | "lock" | "zoom" | "open"

const TEX = {
  earth: "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
  bump: "//unpkg.com/three-globe/example/img/earth-topology.png",
  water: "//unpkg.com/three-globe/example/img/earth-water.png",
  stars: "//unpkg.com/three-globe/example/img/night-sky.png",
}

export function WorldZoomTransition({ onComplete }: WorldZoomTransitionProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const done = useRef(false)
  const [phase, setPhase] = useState<Phase>("spin")
  const [status, setStatus] = useState("Rotating Earth — drag to explore the globe")
  const [size, setSize] = useState({ w: 800, h: 600 })
  const [rings, setRings] = useState<
    { lat: number; lng: number; maxR: number; prog: number; color: string }[]
  >([])

  const finish = useCallback(() => {
    if (done.current) return
    done.current = true
    onComplete()
  }, [onComplete])

  useEffect(() => {
    const measure = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  useEffect(() => {
    const timers: number[] = []
    let cancelled = false

    const waitForGlobe = window.setInterval(() => {
      const g = globeRef.current
      if (!g || cancelled) return
      window.clearInterval(waitForGlobe)

      // Richer, more detailed globe material
      try {
        const raw = g as unknown as { globeMaterial?: () => {
          bumpScale?: number
          shininess?: number
          specular?: Color
          color?: Color
        } }
        const mat = raw.globeMaterial?.()
        if (mat) {
          if (mat.bumpScale != null) mat.bumpScale = 14
          if (mat.shininess != null) mat.shininess = 18
          if (mat.specular) mat.specular = new Color("#cfe8ff")
          if (mat.color) mat.color = new Color("#ffffff")
        }
      } catch {
        /* material tuning optional */
      }

      const controls = g.controls()
      controls.enableDamping = true
      controls.dampingFactor = 0.06
      controls.enableZoom = true
      controls.enableRotate = true
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.85

      // Start over Indian Ocean — Sri Lanka already in frame while spinning
      g.pointOfView({ lat: 6, lng: 78, altitude: 2.45 }, 0)

      // Soft settle: face Sri Lanka while still turning briefly
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return
          setStatus("Aligning to South Asia…")
          g.pointOfView({ lat: SRI_LANKA.lat, lng: SRI_LANKA.lng, altitude: 2.05 }, 2400)
        }, 1600),
      )

      // Lock: stop spin, mark Sri Lanka precisely
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return
          controls.autoRotate = false
          setPhase("lock")
          setStatus("Sri Lanka locked — 7.87°N, 80.77°E")
          setRings([
            { lat: SRI_LANKA.lat, lng: SRI_LANKA.lng, maxR: 5.5, prog: 0, color: "rgba(125,211,252,0.85)" },
            { lat: SRI_LANKA.lat, lng: SRI_LANKA.lng, maxR: 2.8, prog: 0.25, color: "rgba(255,255,255,0.9)" },
          ])
          g.pointOfView({ lat: SRI_LANKA.lat, lng: SRI_LANKA.lng, altitude: 1.15 }, 2800)
        }, 4200),
      )

      // Natural zoom — two-stage, spot-on
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return
          setPhase("zoom")
          setStatus("Descending into Sri Lanka…")
          setRings([
            { lat: SRI_LANKA.lat, lng: SRI_LANKA.lng, maxR: 2.4, prog: 0, color: "rgba(56,189,248,0.9)" },
            { lat: SRI_LANKA.lat, lng: SRI_LANKA.lng, maxR: 1.35, prog: 0.3, color: "rgba(255,255,255,0.95)" },
            { lat: SRI_LANKA.lat, lng: SRI_LANKA.lng, maxR: 0.7, prog: 0.55, color: "rgba(186,230,253,0.85)" },
          ])
          g.pointOfView({ lat: SRI_LANKA.lat, lng: SRI_LANKA.lng, altitude: 0.55 }, 2600)
        }, 7200),
      )

      timers.push(
        window.setTimeout(() => {
          if (cancelled) return
          setStatus("Life Bridge node — Sri Lanka")
          g.pointOfView({ lat: SRI_LANKA.lat, lng: SRI_LANKA.lng, altitude: 0.28 }, 2200)
        }, 10000),
      )

      timers.push(
        window.setTimeout(() => {
          if (cancelled) return
          setPhase("open")
          setStatus("Opening dashboard…")
        }, 12500),
      )
      timers.push(window.setTimeout(() => finish(), 13300))
    }, 60)

    return () => {
      cancelled = true
      window.clearInterval(waitForGlobe)
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [finish])

  useEffect(() => {
    if (phase === "spin" || phase === "open") return
    const id = window.setInterval(() => {
      setRings((prev) =>
        prev.map((r, i) => ({
          ...r,
          prog: (r.prog + 0.01 + i * 0.003) % 1,
        })),
      )
    }, 40)
    return () => window.clearInterval(id)
  }, [phase])

  const points = useMemo(
    () => [
      {
        lat: SRI_LANKA.lat,
        lng: SRI_LANKA.lng,
        size: phase === "spin" ? 0.28 : phase === "lock" ? 0.55 : 0.85,
        color: "#ffffff",
        label: "Sri Lanka",
      },
      {
        lat: SRI_LANKA.lat,
        lng: SRI_LANKA.lng,
        size: phase === "spin" ? 0.12 : 0.28,
        color: "#38bdf8",
        label: "",
      },
    ],
    [phase],
  )

  const arcs = useMemo(
    () =>
      phase === "spin"
        ? []
        : [
            {
              startLat: 28.6139,
              startLng: 77.209,
              endLat: SRI_LANKA.lat,
              endLng: SRI_LANKA.lng,
              color: ["#bae6fd", "#ffffff"],
            },
            {
              startLat: 1.3521,
              startLng: 103.8198,
              endLat: SRI_LANKA.lat,
              endLng: SRI_LANKA.lng,
              color: ["#7dd3fc", "#e0f2fe"],
            },
            {
              startLat: 25.2048,
              startLng: 55.2708,
              endLat: SRI_LANKA.lat,
              endLng: SRI_LANKA.lng,
              color: ["#38bdf8", "#ffffff"],
            },
          ],
    [phase],
  )

  const skip = () => {
    setPhase("open")
    setStatus("Opening dashboard…")
    const g = globeRef.current
    if (g) {
      g.controls().autoRotate = false
      g.pointOfView({ lat: SRI_LANKA.lat, lng: SRI_LANKA.lng, altitude: 0.3 }, 700)
    }
    window.setTimeout(() => finish(), 750)
  }

  return (
    <div
      className={`world-zoom fixed inset-0 z-[90] overflow-hidden bg-[#07111f] ${
        phase === "open" ? "world-zoom-exit" : ""
      }`}
    >
      <div className="absolute inset-0">
        <Globe
          ref={globeRef}
          width={size.w}
          height={size.h}
          backgroundColor="rgba(7,17,31,0)"
          globeImageUrl={TEX.earth}
          bumpImageUrl={TEX.bump}
          backgroundImageUrl={TEX.stars}
          atmosphereColor="#b8dcff"
          atmosphereAltitude={0.18}
          showAtmosphere
          animateIn
          rendererConfig={{ antialias: true, alpha: true }}
          pointsData={points}
          pointAltitude={0.008}
          pointRadius="size"
          pointColor="color"
          pointLabel="label"
          ringsData={rings}
          ringColor="color"
          ringMaxRadius="maxR"
          ringPropagationSpeed={1.6}
          ringRepeatPeriod={1100}
          arcsData={arcs}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={0.28}
          arcDashAnimateTime={2200}
          arcStroke={0.65}
          arcAltitude={0.18}
          labelsData={
            phase === "spin"
              ? []
              : [
                  {
                    lat: SRI_LANKA.lat,
                    lng: SRI_LANKA.lng,
                    text: "Sri Lanka",
                    color: "#f8fbff",
                    size: 1.55,
                  },
                ]
          }
          labelText="text"
          labelColor="color"
          labelSize="size"
          labelDotRadius={0.28}
          labelAltitude={0.018}
          onGlobeReady={() => {
            const g = globeRef.current
            if (!g) return
            g.controls().enableDamping = true
            g.controls().dampingFactor = 0.06
            try {
              const raw = g as unknown as {
                globeMaterial?: () => {
                  bumpScale?: number
                  shininess?: number
                  specular?: Color
                }
              }
              const mat = raw.globeMaterial?.()
              if (mat) {
                if (mat.bumpScale != null) mat.bumpScale = 14
                if (mat.shininess != null) mat.shininess = 18
                if (mat.specular) mat.specular = new Color("#d9ecff")
              }
            } catch {
              /* ignore */
            }
          }}
        />
      </div>

      {/* Professional white–blue washes */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a1628]/45 via-transparent to-[#07111f]/80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(186,230,253,0.08)_0%,transparent_45%,rgba(7,17,31,0.75)_100%)]" />

      {/* Cool HUD frame */}
      <div className="pointer-events-none absolute inset-5 rounded-[28px] border border-sky-200/25 shadow-[inset_0_0_80px_rgba(125,211,252,0.1)] sm:inset-8" />
      <div className="pointer-events-none absolute top-5 left-5 h-12 w-12 rounded-tl-3xl border-t-2 border-l-2 border-white/70 sm:top-8 sm:left-8" />
      <div className="pointer-events-none absolute top-5 right-5 h-12 w-12 rounded-tr-3xl border-t-2 border-r-2 border-sky-300/80 sm:top-8 sm:right-8" />
      <div className="pointer-events-none absolute bottom-5 left-5 h-12 w-12 rounded-bl-3xl border-b-2 border-l-2 border-sky-300/60 sm:bottom-8 sm:left-8" />
      <div className="pointer-events-none absolute right-5 bottom-5 h-12 w-12 rounded-br-3xl border-r-2 border-b-2 border-white/50 sm:right-8 sm:bottom-8" />

      <div className="absolute top-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/25 bg-[#0b1f33]/75 px-5 py-2.5 shadow-[0_0_28px_rgba(125,211,252,0.25)] backdrop-blur-md sm:top-12">
        <Orbit
          className={`h-4 w-4 text-sky-300 ${phase === "spin" ? "animate-spin" : ""}`}
          style={{ animationDuration: "4.5s" }}
        />
        <span className="text-[11px] font-bold tracking-[0.22em] text-white uppercase">
          Fear2Safe · Global View
        </span>
        <Sparkles className="h-3.5 w-3.5 text-sky-200" />
      </div>

      {phase === "spin" && (
        <p className="absolute top-24 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-sky-100/80 backdrop-blur sm:top-28">
          Drag to spin · Scroll to explore
        </p>
      )}

      <div
        className={`absolute bottom-24 left-1/2 z-10 w-[min(94%,24rem)] -translate-x-1/2 rounded-[20px] border border-white/20 bg-[#0b1f33]/88 p-5 shadow-[0_16px_50px_rgba(8,20,40,0.55),0_0_40px_rgba(125,211,252,0.18)] backdrop-blur-xl transition duration-700 sm:bottom-28 ${
          phase === "spin" ? "translate-y-2 opacity-90" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300 to-sky-500 text-white shadow-[0_0_24px_rgba(56,189,248,0.45)]">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold tracking-wider text-sky-300 uppercase">
              {phase === "spin"
                ? "Orbital scan"
                : phase === "lock"
                  ? "Coordinates locked"
                  : phase === "zoom"
                    ? "Descending"
                    : "Ready"}
            </p>
            <p className="mt-0.5 text-xl font-extrabold text-white">Sri Lanka</p>
            <p className="text-xs text-sky-100/65">7.8731°N · 80.7718°E · Life Bridge Node</p>
            <p className="mt-2 text-sm font-semibold text-sky-200">{status}</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {(["spin", "lock", "zoom", "open"] as Phase[]).map((p, i) => {
            const order: Phase[] = ["spin", "lock", "zoom", "open"]
            const active = order.indexOf(phase) >= i
            return (
              <span
                key={p}
                className="h-1.5 flex-1 rounded-full transition-all duration-500"
                style={{
                  background: active
                    ? "linear-gradient(90deg,#ffffff,#7dd3fc,#38bdf8)"
                    : "rgba(255,255,255,0.12)",
                  boxShadow: active ? "0 0 12px rgba(125,211,252,0.55)" : "none",
                }}
              />
            )
          })}
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-bold tracking-wide text-white/35 uppercase">
          <span>Orbit</span>
          <span>Lock</span>
          <span>Zoom</span>
          <span>Enter</span>
        </div>
      </div>

      <button
        type="button"
        onClick={skip}
        className="absolute right-6 bottom-8 z-10 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-sky-50/90 backdrop-blur transition hover:border-sky-300/50 hover:bg-sky-400/20 hover:text-white sm:right-10 sm:bottom-12"
      >
        Skip to dashboard
      </button>
    </div>
  )
}
