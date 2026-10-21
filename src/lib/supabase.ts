import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) as string | undefined

export const watchImei = (import.meta.env.VITE_WATCH_IMEI as string | undefined)?.trim() || null

export const isWatchLiveConfigured = Boolean(url && anonKey)

let client: SupabaseClient | null = null

export function getSupabase() {
  if (!isWatchLiveConfigured) return null
  if (!client) {
    client = createClient(url!, anonKey!, {
      realtime: { params: { eventsPerSecond: 20 } },
    })
  }
  return client
}

/** Public Realtime topic filled by `broadcast_watch_live()` on new watch rows. */
export const WATCH_LIVE_TOPIC = "watch-live"
export const WATCH_LIVE_EVENT = "watch_packet"

export type WatchLiveSnapshot = {
  ok: boolean
  error?: string
  imei?: string
  last_seen_at?: string | null
  location?: {
    lat: number | null
    lng: number | null
    speed_kmh: number | null
    gps_valid: boolean | null
    battery: number | null
    gsm_signal: number | null
    satellites: number | null
    recorded_at: string
  } | null
  heartbeat?: {
    battery: number | null
    gsm_signal: number | null
    satellites: number | null
    recorded_at: string
  } | null
  health?: {
    metric_kind: string | null
    heart_rate: number | null
    spo2: number | null
    temperature_c: number | null
    battery: number | null
    bp_systolic?: number | null
    bp_diastolic?: number | null
    recorded_at: string
  } | null
  wear?: {
    on_wrist: boolean | null
    label: "On wrist" | "Off wrist" | "Unknown"
    source?: string | null
    recorded_at?: string | null
  } | null
  clock?: {
    tz_offset: number | null
    gps_date: string | null
    gps_time: string | null
    recorded_at?: string | null
  } | null
}

export async function fetchWatchLiveSnapshot(imei?: string | null): Promise<WatchLiveSnapshot> {
  const sb = getSupabase()
  if (!sb) return { ok: false, error: "not_configured" }

  const { data, error } = await sb.rpc("get_watch_live_snapshot", {
    p_imei: imei || watchImei || null,
  })

  if (error) return { ok: false, error: error.message }
  return (data ?? { ok: false, error: "empty" }) as WatchLiveSnapshot
}
