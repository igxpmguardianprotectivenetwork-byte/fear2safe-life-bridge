const AVATAR_BY_ID: Record<string, string> = {
  p1: "/avatars/priya.png",
  p2: "/avatars/meera.png",
  p3: "/avatars/ananya.png",
  p4: "/avatars/nuwan.png",
  p5: "/avatars/sanduni.png",
  p6: "/avatars/nuwan.png",
}

/** 3D CGI-style character portraits with soft idle motion */
export function UserAvatar({
  userId,
  label,
  size = "md",
}: {
  userId: string
  label: string
  size?: "sm" | "md"
}) {
  const src = AVATAR_BY_ID[userId] ?? AVATAR_BY_ID.p1
  const dim = size === "sm" ? "h-7 w-7" : "h-14 w-14"

  return (
    <span className={`lv-avatar-photo lv-avatar-3d relative block overflow-hidden ${dim}`}>
      <img src={src} alt={label} className="lv-avatar-3d-img h-full w-full object-cover object-top" />
    </span>
  )
}
