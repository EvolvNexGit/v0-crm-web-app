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

    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .eq('crm_user_id', user.id)
      .maybeSingle()

    if (clientError) {
      throw new Error(clientError.message)
    }

    if (!client?.id) {
      setClientId(null)
      return null
    }

    setClientId(client.id)
    return client.id
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
