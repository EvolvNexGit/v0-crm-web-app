import { DashboardClient } from './dashboard-client'
import { ClientGuard } from '@/components/auth/ClientGuard'

export const metadata = {
  title: 'Dashboard - EvolvNex',
}

export default function DashboardPage() {
  return (
    <ClientGuard>
      <DashboardClient />
    </ClientGuard>
  )
}
