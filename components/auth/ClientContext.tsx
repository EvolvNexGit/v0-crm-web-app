'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ClientContextValue = {
  clientId: string | null
  loading: boolean
  refreshClientId: () => Promise<string | null>
  setClientId: (value: string | null) => void
}

const ClientContext = createContext<ClientContextValue | undefined>(undefined)

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [clientId, setClientId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshClientId = async () => {
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      setClientId(null)
      return null
    }

    const response = await fetch('/api/auth/client', { method: 'GET' })
    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      setClientId(null)
      return null
    }

    const resolvedClientId = payload?.client_id ?? null
    setClientId(resolvedClientId)
    return resolvedClientId
  }

  useEffect(() => {
    refreshClientId()
      .catch(() => setClientId(null))
      .finally(() => setLoading(false))
  }, [])

  const value = useMemo(
    () => ({ clientId, loading, refreshClientId, setClientId }),
    [clientId, loading],
  )

  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
}

export function useClient() {
  const context = useContext(ClientContext)
  if (!context) {
    throw new Error('useClient must be used within ClientProvider')
  }
  return context
}
