'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BarChart3, Users, Calendar, LogOut } from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  userEmail?: string
  tenantName?: string
}

export function Sidebar({ userEmail, tenantName }: SidebarProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-64 border-r border-border bg-background flex flex-col h-screen">
      {/* Header */}
      <div className="border-b border-border p-6">
        <h1 className="text-2xl font-bold text-primary">EvolvNex</h1>
        <p className="text-sm text-muted-foreground mt-1">CRM</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/dashboard">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <BarChart3 className="h-5 w-5" />
            Dashboard
          </Button>
        </Link>
        <Link href="/dashboard/customers">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Users className="h-5 w-5" />
            Customers
          </Button>
        </Link>
        <Link href="/dashboard/appointments">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Calendar className="h-5 w-5" />
            Appointments
          </Button>
        </Link>
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-border p-4 space-y-3">
        {(userEmail || tenantName) && (
          <div className="text-sm">
            {tenantName && (
              <p className="font-semibold text-foreground truncate">{tenantName}</p>
            )}
            {userEmail && (
              <p className="text-muted-foreground truncate">{userEmail}</p>
            )}
          </div>
        )}
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
          disabled={loading}
        >
          <LogOut className="h-4 w-4" />
          {loading ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
    </aside>
  )
}
