import { NavLink, Outlet, useLocation } from "react-router-dom"
import {
  Bell,
  LayoutDashboard,
  Map as MapIcon,
  MessageSquare,
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
import { Logo } from "./Logo"

const navGroups = [
  {
    label: "Overview",
    items: [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Protection",
    items: [
      { to: "/device", label: "My Devices", icon: Watch },
      { to: "/map", label: "Live Map", icon: MapIcon },
      { to: "/alerts/risk-detected", label: "Alerts", icon: Siren, badge: 3 },
      { to: "/guardians", label: "Guardians", icon: Users },
    ],
  },
  {
    label: "Insights",
    items: [
      { to: "/reports", label: "Reports", icon: FileBarChart },
      { to: "/messages", label: "Messages", icon: MessageSquare },
    ],
  },
  {
    label: "Account",
    items: [{ to: "/settings", label: "Settings", icon: Settings }],
  },
]

function isActive(pathname: string, to: string) {
  if (to.startsWith("/alerts")) return pathname.startsWith("/alerts")
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function AppShell() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="app-shell min-h-screen bg-[#fff7fa] lg:flex">
      {open && (
        <button
          className="fixed inset-0 z-40 bg-[#3d1f2c]/25 backdrop-blur-[2px] lg:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r-2 border-[#e5a0b4] bg-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b-2 border-[#e5a0b4] px-5 py-4">
          <Logo />
          <button
            className="rounded-lg p-1.5 text-pink hover:bg-[#fff0f5] lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-5 last:mb-0">
              <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.16em] text-[#b0899a] uppercase">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(location.pathname, item.to)
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition ${
                        active
                          ? "bg-[#fff0f5] text-pink shadow-[inset_0_0_0_1px_rgba(233,30,99,0.12)]"
                          : "text-[#6b4555] hover:bg-[#fff8fb] hover:text-[#3d1f2c]"
                      }`}
                    >
                      {active && (
                        <span className="absolute top-1/2 left-0 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-pink" />
                      )}
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                          active
                            ? "bg-pink text-white shadow-sm shadow-pink/30"
                            : "bg-[#fff5f8] text-[#8a6b78] group-hover:bg-[#ffe8f0] group-hover:text-pink"
                        }`}
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.9} />
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {"badge" in item && item.badge ? (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                            active ? "bg-white text-pink" : "bg-pink text-white"
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t-2 border-[#e5a0b4] bg-[#fffafb] p-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink to-pink-deep px-4 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(233,30,99,0.28)] transition hover:brightness-105 active:scale-[0.98]">
            <Phone className="h-4 w-4" />
            Emergency · Always Here
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b-2 border-[#e5a0b4] bg-white/85 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <button
              className="rounded-xl border border-[#e5a0b4] bg-white p-2 text-pink shadow-sm lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative max-w-xl flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#b0899a]" />
              <input
                type="search"
                placeholder="Search people, alerts, locations…"
                className="w-full rounded-xl border border-[#e5a0b4] bg-[#fffafb] py-2.5 pr-4 pl-10 text-sm text-[#3d1f2c] outline-none transition placeholder:text-[#b0899a] focus:border-pink/40 focus:bg-white focus:ring-4 focus:ring-pink/10"
              />
            </div>

            <div className="ml-auto flex items-center gap-2.5">
              <button className="relative rounded-xl border border-[#e5a0b4] bg-white p-2.5 text-[#3d1f2c] shadow-sm transition hover:border-pink/30 hover:bg-[#fff0f5]">
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-pink ring-2 ring-white" />
              </button>
              <div className="flex items-center gap-2.5 rounded-xl border border-[#e5a0b4] bg-white py-1 pr-3 pl-1 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-pink to-pink-deep text-xs font-bold text-white">
                  AH
                </div>
                <div className="hidden leading-tight sm:block">
                  <p className="text-[13px] font-semibold text-[#3d1f2c]">Ahamed</p>
                  <p className="text-[11px] text-[#8a6b78]">Guardian Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
