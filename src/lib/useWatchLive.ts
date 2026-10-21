import { useCallback, useEffect, useMemo, useState } from "react"
import {
  fetchWatchLiveSnapshot,
  getSupabase,
  isWatchLiveConfigured,
  watchImei,
  WATCH_LIVE_EVENT,
  WATCH_LIVE_TOPIC,
  type WatchLiveSnapshot,
} from "./supabase"
import type { ProtectionDevice } from "../data/devices"
import { myDevice } from "../data/devices"

export function isValidGps(lat: number | null | undefined, lng: number | null | undefined) {
  if (lat == null || lng == null) return false
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false
  if (Math.abs(lat) < 0.001 && Math.abs(lng) < 0.001) return false
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false
  return true
}

/** @deprecated use isValidGps — kept for Live Map imports */
export function isInLiveMapRegion(lat: number | null | undefined, lng: number | null | undefined) {
  return isValidGps(lat, lng)
}

function relativeTime(iso?: string | null) {
  if (!iso) return "—"
  const t = new Date(iso).getTime()
  if (!Number.isFinite(t)) return "—"
  const sec = Math.max(0, Math.round((Date.now() - t) / 1000))
  if (sec < 15) return "Just now"
  if (sec < 60) return `${sec} sec ago`
  const min = Math.round(sec / 60)
  if (min < 60) return `${min} min ago`
  const hr = Math.round(min / 60)
  if (hr < 48) return `${hr} hr ago`
  return new Date(iso).toLocaleString()
}

function signalLabel(gsm?: number | null): ProtectionDevice["signalStrength"] {
  if (gsm == null) return "Fair"
  if (gsm >= 60) return "Strong"
  if (gsm >= 30) return "Fair"
  return "Weak"
}

export function mergeWatchIntoMyDevice(
  base: ProtectionDevice,
  snap: WatchLiveSnapshot | null,
): ProtectionDevice {
  if (!snap?.ok) return base

  const battery =
    snap.heartbeat?.battery ??
    snap.location?.battery ??
    snap.health?.battery ??
    base.battery

  const gsm = snap.heartbeat?.gsm_signal ?? snap.location?.gsm_signal ?? null
  const lastAt =
    snap.location?.recorded_at ??
    snap.heartbeat?.recorded_at ??
    snap.health?.recorded_at ??
    snap.last_seen_at ??
    null

  const lat = snap.location?.lat
  const lng = snap.location?.lng
  const hasGps = Boolean(snap.location?.gps_valid && isValidGps(lat, lng))

  const location = hasGps
    ? `Live GPS · ${lat!.toFixed(5)}, ${lng!.toFixed(5)}`
    : base.location

  return {
    ...base,
    label: "My Device",
    serial: snap.imei ? `IMEI ${snap.imei}` : base.serial,
    connected: Boolean(snap.last_seen_at || snap.location || snap.heartbeat || snap.health),
    gpsFix: hasGps,
    onWrist: snap.wear?.on_wrist ?? null,
    lastSync: relativeTime(lastAt),
    battery: typeof battery === "number" ? Math.max(0, Math.min(100, battery)) : base.battery,
    signalStrength: signalLabel(gsm),
    location,
    gpsAccuracy: hasGps
      ? (snap.location?.satellites ?? 0) >= 6
        ? "High"
        : (snap.location?.satellites ?? 0) >= 3
          ? "Medium"
          : "Low"
      : base.gpsAccuracy,
    heartRate: snap.health?.heart_rate ?? base.heartRate,
    spo2: snap.health?.spo2 ?? base.spo2,
    skinTemperature: snap.health?.temperature_c ?? base.skinTemperature,
    restingHr: snap.health?.heart_rate ?? base.restingHr,
    activity: hasGps && (snap.location?.speed_kmh ?? 0) > 1 ? "Moving" : base.activity,
    activityNote: hasGps
      ? `Watch GPS · ${snap.location?.speed_kmh?.toFixed?.(1) ?? 0} km/h`
      : base.activityNote,
    locomotion:
      hasGps && (snap.location?.speed_kmh ?? 0) > 3
        ? "Running"
        : hasGps && (snap.location?.speed_kmh ?? 0) > 0.5
          ? "Walking"
          : "Still",
  }
}

export function wristStatusLabel(onWrist: boolean | null | undefined) {
  if (onWrist === true) return "On wrist"
  if (onWrist === false) return "Off wrist"
  return "Wrist unknown"
}

export type WatchLiveCoords = { lat: number; lng: number; accuracy: number } | null

export function useWatchLive(pollMs = 4000) {
  const [snapshot, setSnapshot] = useState<WatchLiveSnapshot | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(isWatchLiveConfigured)
  const [realtime, setRealtime] = useState(false)
  const offWrist = snapshot?.wear?.on_wrist === false
  const intervalMs = offWrist ? Math.min(pollMs, 1500) : pollMs

  const refresh = useCallback(async () => {
    if (!isWatchLiveConfigured) {
      setLoading(false)
      setError("Supabase not configured")
      return
    }
    try {
      const snap = await fetchWatchLiveSnapshot(watchImei)
      setSnapshot(snap)
      setError(snap.ok ? null : snap.error ?? "unavailable")
    } catch (e) {
      setError(e instanceof Error ? e.message : "fetch_failed")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
    if (!isWatchLiveConfigured) return
    const id = window.setInterval(() => void refresh(), intervalMs)
    return () => window.clearInterval(id)
  }, [refresh, intervalMs])

  useEffect(() => {
    const sb = getSupabase()
    if (!sb || !isWatchLiveConfigured) return

    const channel = sb
      .channel(WATCH_LIVE_TOPIC, { config: { broadcast: { ack: false } } })
      .on("broadcast", { event: WATCH_LIVE_EVENT }, (msg) => {
        const body = (msg?.payload ?? msg) as { imei?: string }
        if (watchImei && body?.imei && body.imei !== watchImei) return
        void refresh()
      })
      .subscribe((status) => {
        setRealtime(status === "SUBSCRIBED")
      })

    return () => {
      setRealtime(false)
      void sb.removeChannel(channel)
    }
  }, [refresh])

  const device = mergeWatchIntoMyDevice(myDevice, snapshot)

  const coords: WatchLiveCoords = useMemo(() => {
    const loc = snapshot?.location
    if (!loc?.gps_valid || !isValidGps(loc.lat, loc.lng)) return null
    return {
      lat: loc.lat!,
      lng: loc.lng!,
      accuracy: Math.max(15, 80 - (loc.satellites ?? 0) * 5),
    }
  }, [
    snapshot?.location?.gps_valid,
    snapshot?.location?.lat,
    snapshot?.location?.lng,
    snapshot?.location?.satellites,
  ])

  return {
    configured: isWatchLiveConfigured,
    loading,
    error,
    snapshot,
    device,
    coords,
    realtime,
    refresh,
  }
}
