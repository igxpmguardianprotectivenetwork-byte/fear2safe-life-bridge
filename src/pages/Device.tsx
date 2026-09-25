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

export function Device() {
  const [selectedId, setSelectedId] = useState(6)
  const device = useMemo(
    () => protectionDevices.find((d) => d.id === selectedId) ?? protectionDevices[0],
    [selectedId],
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
          devices={protectionDevices}
        />

        <div className="f2s-device-main">
          <DeviceHero device={device} />
          <div className="f2s-status-stack">
            <ConnectionStatusCard device={device} />
            <BatteryStatusCard device={device} />
            <LocationCard device={device} />
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
