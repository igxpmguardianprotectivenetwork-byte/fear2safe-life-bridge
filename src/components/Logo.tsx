import { Link } from "react-router-dom"
import { igxpmLogoUrl } from "../lib/brand"

type LogoProps = {
  className?: string
  /** Smaller mark for tight sidebars */
  compact?: boolean
  /** Kept for callers; image logo works on light and dark */
  light?: boolean
  /** Link target when clickable (default /home) */
  href?: string
  /** Link to home (default true) */
  toHome?: boolean
  /** Pink glow ring — landing / login */
  glow?: boolean
}

export function Logo({
  className = "",
  compact = false,
  toHome = true,
  glow = false,
  href = "/home",
}: LogoProps) {
  const size = compact ? "h-14 w-14 sm:h-16 sm:w-16" : "h-[4.25rem] w-[4.25rem] sm:h-[4.75rem] sm:w-[4.75rem]"

  const mark = (
    <img
      src={igxpmLogoUrl}
      alt="IGXPM Guardian Protective Network"
      className={`${glow ? "logo-glow ring-2 ring-pink/50" : "shadow-sm ring-1 ring-black/5"} ${size} rounded-full bg-white object-contain ${className}`}
    />
  )

  if (!toHome) return mark

  return (
    <Link to={href} className="inline-flex shrink-0 items-center" aria-label="IGXPM home">
      {mark}
    </Link>
  )
}
