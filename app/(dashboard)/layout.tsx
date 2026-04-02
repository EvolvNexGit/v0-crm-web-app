import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Dashboard - EvolvNex CRM',
  description: 'Manage your customers and appointments',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get tenant info
  const { data: userData } = await supabase
    .from('users')
    .select('*, tenants(*)')
    .eq('id', user.id)
    .single()

  const tenantName = userData?.tenants?.name

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userEmail={user.email} tenantName={tenantName} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
