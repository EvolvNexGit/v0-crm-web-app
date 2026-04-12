'use client'

import { createContext, useContext, useState } from 'react'

type AuthSession = {
  clientId: string | null
  userId: string | null
}

type AuthContextValue = AuthSession & {
  setSession: (session: AuthSession) => void
  clearSession: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({
  children,
  initialClientId = null,
  initialUserId = null,
}: {
  children: React.ReactNode
  initialClientId?: string | null
  initialUserId?: string | null
}) {
  const [clientId, setClientId] = useState<string | null>(initialClientId)
  const [userId, setUserId] = useState<string | null>(initialUserId)

  const value: AuthContextValue = {
    clientId,
    userId,
    setSession: ({ clientId: nextClientId, userId: nextUserId }) => {
      setClientId(nextClientId)
      setUserId(nextUserId)
    },
    clearSession: () => {
      setClientId(null)
      setUserId(null)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}