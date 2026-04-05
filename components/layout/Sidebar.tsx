'use client'

import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { BarChart3, Users, Calendar, LogOut } from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  userEmail?: string
  tenantName?: string
}

export function Sidebar({ userEmail, tenantName }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: BarChart3,
    },
    {
      name: 'Customers',
      href: '/dashboard/customers',
      icon: Users,
    },
    {
      name: 'Appointments',
      href: '/dashboard/appointments',
      icon: Calendar,
    },
  ]

  return (
    <aside className="w-64 border-r bg-white flex flex-col h-screen shadow-sm">
      
      {/* 🔥 HEADER WITH LOGO */}
      <div className="border-b p-6 flex flex-col items-center gap-2">
        <Image
          src="/black_full_logo.png"
          alt="EvolvNex"
          width={140}
          height={40}
          priority
        />
        <p className="text-xs text-gray-500 tracking-wide">
          CRM Platform
        </p>
      </div>

      {/* 🔥 NAVIGATION */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 rounded-lg transition ${
                  isActive
                    ? 'bg-gray-100 text-black font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* 🔥 USER + LOGOUT */}
      <div className="border-t p-4 space-y-3">
        {(userEmail || tenantName) && (
          <div className="text-sm">
            {tenantName && (
              <p className="font-semibold text-black truncate">
                {tenantName}
              </p>
            )}
            {userEmail && (
              <p className="text-gray-500 truncate">
                {userEmail}
              </p>
            )}
          </div>
        )}

        <Button
          variant="outline"
          className="w-full justify-start gap-2 rounded-lg"
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