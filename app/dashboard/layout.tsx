import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { redirect } from 'next/navigation'
import { getClientId } from '@/lib/supabase/queries'

export const metadata = {
  title: 'Dashboard - EvolvNex CRM',
  description: 'Manage your appointments',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      redirect('/login')
    }

    const clientId = await getClientId()
    if (!clientId) {
      redirect('/login')
    }

    return (
      <div className="flex h-screen bg-background">
        <Sidebar userEmail={user.email} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    )
  } catch (error) {
    console.error('[dashboard layout] auth/client resolution failed:', error)
    redirect('/login')
  }
}
