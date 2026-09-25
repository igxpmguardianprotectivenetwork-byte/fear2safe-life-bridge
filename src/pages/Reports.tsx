import {
  AlertsByTimeCard,
  AlertsByTypeCard,
  DeviceHealthStatus,
  InsightStrip,
  KpiGrid,
  ProtectionRiskTrend,
  ReportsHeader,
  TopTriggerZones,
} from "../components/reports/ReportsPageParts"

export function Reports() {
  const onExport = () => {
    window.alert("Export prepared for Network Overview · Sep 2026 (demo). PDF / CSV options can connect to your report API.")
  }

  return (
    <div className="f2s-reports-page">
      <div className="f2s-rpt-shell">
        <ReportsHeader onExport={onExport} />
        <KpiGrid />
        <div className="f2s-rpt-main-row">
          <AlertsByTypeCard />
          <AlertsByTimeCard />
        </div>
        <div className="f2s-rpt-second-row">
          <ProtectionRiskTrend />
          <TopTriggerZones />
          <DeviceHealthStatus />
        </div>
        <InsightStrip />
      </div>
    </div>
  )
}
