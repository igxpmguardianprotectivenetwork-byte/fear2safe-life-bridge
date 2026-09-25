export function HealthBand3D({ variant = "panel" }: { variant?: "panel" | "pedestal" }) {
  if (variant === "pedestal") {
    return (
      <div className="f2s-band-pedestal relative mx-auto flex h-full min-h-[200px] w-full max-w-md flex-col items-center justify-end">
        <div className="pointer-events-none absolute bottom-6 left-1/2 h-24 w-52 -translate-x-1/2 rounded-[100%] bg-[#12CBEA]/28 blur-2xl" />
        <div className="pointer-events-none absolute bottom-8 left-1/2 h-7 w-40 -translate-x-1/2 rounded-[100%] border border-[#7DD3FC]/70 bg-gradient-to-b from-white/90 to-[#BAE6FD]/75 shadow-[0_0_24px_rgba(18,203,234,0.35)]" />
        <img
          src={`${import.meta.env.BASE_URL}images/philips-health-band.png`}
          alt="Fear2Safe health band"
          className="f2s-band-img relative z-10 mb-4 w-auto max-w-full object-contain drop-shadow-[0_14px_24px_rgba(16,42,67,0.22)]"
        />
      </div>
    )
  }

  return (
    <div className="relative flex h-[340px] w-full items-center justify-center overflow-hidden rounded-[18px] bg-gradient-to-b from-[#F5F9FC] via-[#DCEFFA] to-[#DCEFFA]">
      <div className="pointer-events-none absolute inset-x-16 top-10 h-28 rounded-full bg-[#102A43]/5 blur-3xl" />
      <img
        src={`${import.meta.env.BASE_URL}images/philips-health-band.png`}
        alt="Fear2Safe health band"
        className="relative z-10 h-[280px] w-auto max-w-full object-contain drop-shadow-lg"
      />
    </div>
  )
}
