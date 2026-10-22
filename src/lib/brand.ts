const base = import.meta.env.BASE_URL

export const brandUrl = (file: string) => `${base}${file.replace(/^\//, "")}`

export const igxpmLogoUrl = brandUrl("brand/igxpm-logo.png")
export const heroPhotoUrl = brandUrl("brand/hero-mother-child.png")
