'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useClient } from '@/components/auth/ClientContext'

export function ClientGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { clientId, loading } = useClient()

  useEffect(() => {
    if (!loading && !clientId) {
      router.replace('/login')
    }
  }, [loading, clientId, router])

  if (loading || !clientId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading your workspace...</div>
      </div>
    )
  }

  return <>{children}</>
}
