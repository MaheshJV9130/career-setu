'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export interface SafeUser {
  id: string
  name: string
  email: string
  role: string
  status?: string
}

interface AuthContextType {
  user: SafeUser | null
  loading: boolean
  authenticated: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<SafeUser | null>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  authenticated: false,
  logout: async () => {},
  refreshUser: async () => null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<SafeUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async (): Promise<SafeUser | null> => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        const userData = data.data?.user || data.user
        if (userData) {
          const safe: SafeUser = {
            id: userData.id || userData._id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            status: userData.status,
          }
          setUser(safe)
          return safe
        }
      }
      setUser(null)
      return null
    } catch (error) {
      console.error('[AuthProvider] Error loading user:', error)
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('[AuthProvider] Logout error:', error)
    } finally {
      setUser(null)
      router.push('/')
      router.refresh()
    }
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authenticated: !!user,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
