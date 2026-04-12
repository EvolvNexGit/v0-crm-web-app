import { createAdminClient } from '@/lib/supabase/admin'
import { Sidebar } from '@/components/layout/Sidebar'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/supabase/queries'

export const metadata = {
  title: 'Dashboard - EvolvNex CRM',
  description: 'Manage your appointments',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createAdminClient()
  const currentUser = await getCurrentUser()

  if (!currentUser?.B2C_end_user_id) {
    redirect('/login')
  }

  const { data: clientData } = await supabase
    .from('clients')
    .select('name')
    .eq('id', currentUser.B2C_end_user_id)
    .single()

  const tenantName = clientData?.name

  return (
    <div className="flex h-screen bg-background">
      <Sidebar tenantName={tenantName} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
