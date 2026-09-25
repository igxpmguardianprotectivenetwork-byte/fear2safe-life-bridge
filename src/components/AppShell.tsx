import { NavLink, Outlet, useLocation } from "react-router-dom"
import {
  Bell,
  LayoutDashboard,
  Map as MapIcon,
  Settings,
  Phone,
  Siren,
  Users,
  Watch,
  FileBarChart,
  Menu,
  X,
  Search,
} from "lucide-react"
import { useState } from "react"
import { getActiveIncidents } from "../data/mock"
import { Logo } from "./Logo"

const activeAlertCount = getActiveIncidents().length

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/device", label: "My Devices", icon: Watch },
  { to: "/map", label: "Live Map", icon: MapIcon },
  { to: "/alerts/risk-detected", label: "Alerts", icon: Siren, badge: activeAlertCount },
  { to: "/guardians", label: "Guardians", icon: Users },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/settings", label: "Settings", icon: Settings },
]

function isActive(pathname: string, to: string) {
  if (to.startsWith("/alerts")) return pathname.startsWith("/alerts")
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function AppShell() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="app-shell flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-[#DCE6EE] bg-[#FFFFFF]/95 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Logo compact />

          <div className="relative mx-2 hidden max-w-md flex-1 md:block lg:max-w-lg">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#486174]/70" />
            <input
              type="search"
              placeholder="Search people, alerts, locations…"
              className="w-full rounded-xl border border-[#DCE6EE] bg-[#F5F9FC] py-2.5 pr-4 pl-10 text-sm text-[#102A43] outline-none transition placeholder:text-[#486174]/60 focus:border-[#007F86]/40 focus:bg-white focus:ring-4 focus:ring-[#007F86]/10"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="hidden items-center gap-2 rounded-xl bg-[#FF4D5A] px-3.5 py-2.5 text-xs font-bold text-white shadow-[0_0_16px_rgba(255,77,90,0.45),0_6px_16px_rgba(255,77,90,0.28)] transition hover:bg-[#E03D4A] sm:inline-flex">
              <Phone className="h-3.5 w-3.5" />
              Emergency
            </button>
            <button className="relative rounded-xl border border-[#DCE6EE] bg-white p-2.5 text-[#102A43] shadow-sm transition hover:border-[#007F86]/30 hover:bg-[#DCEFFA]">
              <Bell className="h-[18px] w-[18px]" />
              <span className="vital-dot absolute top-2 right-2 h-2 w-2 rounded-full bg-[#FF4D5A] text-[#FF4D5A] ring-2 ring-white" />
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-[#DCE6EE] bg-white py-1 pr-2.5 pl-1 shadow-sm sm:pr-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#007F86] text-[11px] font-bold text-white sm:h-9 sm:w-9 sm:text-xs">
                AH
              </div>
              <div className="hidden leading-tight md:block">
                <p className="text-[13px] font-semibold text-[#102A43]">Ahamed</p>
                <p className="text-[11px] text-[#486174]">Guardian Admin</p>
              </div>
            </div>
            <button
              className="rounded-xl border border-[#DCE6EE] bg-white p-2 text-[#007F86] shadow-sm lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <nav className="hidden border-t border-[#DCE6EE] px-4 lg:block sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(location.pathname, item.to)
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`relative inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-semibold transition ${
                    active
                      ? "bg-[#DCEFFA] text-[#007F86] shadow-[inset_0_0_0_1px_rgba(0,127,134,0.15)]"
                      : "text-[#486174] hover:bg-[#F5F9FC] hover:text-[#102A43]"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-x-3 -bottom-[9px] h-[3px] rounded-t-full bg-[#007F86]" />
                  )}
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                      active ? "bg-[#007F86] text-white" : "bg-[#F5F9FC] text-[#486174]"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  <span className={active ? "text-[#102A43]" : undefined}>{item.label}</span>
                  {"badge" in item && item.badge ? (
                    <span className="rounded-full bg-[#FF4D5A] px-1.5 py-0.5 text-[10px] font-bold text-white tabular-nums shadow-[0_0_10px_rgba(255,77,90,0.45)]">
                      {item.badge}
                    </span>
                  ) : null}
                </NavLink>
              )
            })}
          </div>
        </nav>

        {open && (
          <nav className="border-t border-[#DCE6EE] bg-white px-3 py-3 lg:hidden">
            <div className="mb-3 md:hidden">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#486174]/70" />
                <input
                  type="search"
                  placeholder="Search…"
                  className="w-full rounded-xl border border-[#DCE6EE] bg-[#F5F9FC] py-2.5 pr-4 pl-10 text-sm outline-none focus:border-[#007F86]/40 focus:ring-4 focus:ring-[#007F86]/10"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(location.pathname, item.to)
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-semibold ${
                      active
                        ? "bg-[#DCEFFA] text-[#007F86]"
                        : "bg-[#F5F9FC] text-[#486174] ring-1 ring-[#DCE6EE]"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        active ? "bg-[#007F86] text-white" : "bg-white text-[#486174]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className={`flex-1 truncate ${active ? "text-[#102A43]" : ""}`}>
                      {item.label}
                    </span>
                    {"badge" in item && item.badge ? (
                      <span className="rounded-full bg-[#FF4D5A] px-1.5 py-0.5 text-[10px] font-bold text-white shadow-[0_0_10px_rgba(255,77,90,0.45)]">
                        {item.badge}
                      </span>
                    ) : null}
                  </NavLink>
                )
              })}
            </div>
            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF4D5A] px-4 py-3 text-sm font-bold text-white shadow-[0_0_16px_rgba(255,77,90,0.4)] hover:bg-[#E03D4A] sm:hidden">
              <Phone className="h-4 w-4" />
              Emergency · Always Here
            </button>
          </nav>
        )}
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}
