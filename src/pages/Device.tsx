import { useMemo, useState } from "react"
import {
  BatteryStatusCard,
  ConnectionStatusCard,
  DeviceHero,
  DevicePageHeader,
  HealthActivityPanel,
  LocationCard,
  ProtectionStateCard,
  QuickActions,
  RecentSafetyActivity,
  SafetyTip,
} from "../components/device/DevicePageParts"
import { protectionDevices } from "../data/devices"
import { useWatchLive } from "../lib/useWatchLive"

export function Device() {
  const [selectedId, setSelectedId] = useState(6)
  const { device: liveMine, configured, loading, error, coords, snapshot, realtime } = useWatchLive()

  const device = useMemo(() => {
    if (selectedId === 6) return liveMine
    return protectionDevices.find((d) => d.id === selectedId) ?? protectionDevices[0]
  }, [selectedId, liveMine])

  const devices = useMemo(
    () => protectionDevices.map((d) => (d.id === 6 ? liveMine : d)),
    [liveMine],
  )

  const onTestSos = () => {
    window.alert(
      "Test SOS only — no real alert was sent. Your guardians would receive a verification check-in in a live scenario.",
    )
  }

  return (
    <div className="f2s-device-page">
      <div className="f2s-device-shell">
        <DevicePageHeader
          device={device}
          selectedId={selectedId}
          onSelect={setSelectedId}
          devices={devices}
        />

        {selectedId === 6 ? (
          <div className="f2s-device-live-banner" role="status">
            {configured ? (
              loading && !snapshot?.ok ? (
                <span>Connecting to TCP watch telemetry…</span>
              ) : snapshot?.ok ? (
                <span>
                  Live from TCP watch · IMEI {snapshot.imei}
                  {realtime ? " · Realtime" : ""}
                  {liveMine.onWrist === true
                    ? " · On wrist"
                    : liveMine.onWrist === false
                      ? " · Off wrist"
                      : ""}
                  {coords
                    ? ` · GPS ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
                    : " · Waiting for GPS fix"}
                </span>
              ) : (
                <span>Watch bridge configured, but no live packet yet{error ? ` (${error})` : ""}.</span>
              )
            ) : (
              <span>
                Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to stream your TCP watch into My Device.
              </span>
            )}
          </div>
        ) : null}

        <div className="f2s-device-main">
          <DeviceHero
            device={device}
            snapshot={selectedId === 6 ? snapshot : null}
            realtime={realtime}
          />
          <div className="f2s-status-stack">
            <ConnectionStatusCard device={device} />
            <BatteryStatusCard device={device} />
            <LocationCard device={device} coords={selectedId === 6 ? coords : null} />
            <ProtectionStateCard device={device} />
          </div>
        </div>

        <QuickActions onTestSos={onTestSos} />

        <RecentSafetyActivity device={device} />

        <HealthActivityPanel device={device} />

        <SafetyTip />
      </div>
    </div>
  )
}
