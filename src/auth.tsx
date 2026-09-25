import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"

type AuthContextValue = {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  // In-memory only — refresh always resets to logged out
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const value = useMemo(
    () => ({
      isLoggedIn,
      login: () => setIsLoggedIn(true),
      logout: () => setIsLoggedIn(false),
    }),
    [isLoggedIn],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

/** Blocks app pages until login; refresh sends users back to login */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth()
  const location = useLocation()
  if (!isLoggedIn) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }
  return children
}
