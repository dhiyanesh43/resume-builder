import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { api, setAuthToken } from '../lib/api'
import type { User } from '../lib/types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// NOTE for learners: for a real production app we'd use short-lived JWTs
// in memory + an HttpOnly refresh-token cookie (see our Phase 4 design).
// For this MVP we simplify to a single token persisted in localStorage,
// which is fine for a local/personal tool but is a deliberate simplification
// worth revisiting before shipping this to real untrusted users.
const STORAGE_KEY = 'resume_builder_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY)
    if (token) {
      setAuthToken(token)
      const stored = localStorage.getItem(STORAGE_KEY + '_user')
      if (stored) setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  function persist(token: string, user: User) {
    localStorage.setItem(STORAGE_KEY, token)
    localStorage.setItem(STORAGE_KEY + '_user', JSON.stringify(user))
    setAuthToken(token)
    setUser(user)
  }

  async function login(email: string, password: string) {
    const result = await api.post<{ token: string; user: User }>('/auth/login', { email, password })
    persist(result.token, result.user)
  }

  async function register(name: string, email: string, password: string) {
    const result = await api.post<{ token: string; user: User }>('/auth/register', { name, email, password })
    persist(result.token, result.user)
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_KEY + '_user')
    setAuthToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
