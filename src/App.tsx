import { Navigate, Route, Routes } from "react-router-dom"
import { RequireAuth } from "./auth"
import { AppShell } from "./components/AppShell"
import { Login } from "./pages/Login"
import { Landing } from "./pages/Landing"
import { Dashboard } from "./pages/Dashboard"
import { AlertDetail } from "./pages/AlertDetail"
import { Guardians } from "./pages/Guardians"
import { Device } from "./pages/Device"
import { LiveMap } from "./pages/LiveMap"
import { Reports } from "./pages/Reports"
import { Settings } from "./pages/Settings"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/home"
        element={
          <RequireAuth>
            <Landing />
          </RequireAuth>
        }
      />
      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alerts/:id" element={<AlertDetail />} />
        <Route path="/guardians" element={<Guardians />} />
        <Route path="/device" element={<Device />} />
        <Route path="/map" element={<LiveMap />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/messages" element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
