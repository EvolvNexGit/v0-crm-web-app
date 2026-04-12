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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const clientId = await getClientId()
  if (!clientId) {
    redirect('/login')
  }

  const { data: clientData } = await supabase
    .from('clients')
    .select('name')
    .eq('id', clientId)
    .single()

  const tenantName = clientData?.name

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userEmail={user.email} tenantName={tenantName} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
