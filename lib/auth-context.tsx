'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  full_name: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.warn('Failed to load auth from localStorage:', error)
    }
  }, [])

  const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
    try {
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
    } catch (error) {
      console.warn('Failed to save auth to localStorage:', error)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('currentProfileId')
    } catch (error) {
      console.warn('Failed to clear auth from localStorage:', error)
    }
  }

  if (!mounted) return null

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAuthenticated: !!token && !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}