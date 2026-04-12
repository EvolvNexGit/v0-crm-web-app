import { AppointmentsPageClient } from './page-client'
import { ClientGuard } from '@/components/auth/ClientGuard'

export const metadata = {
  title: 'Appointments - EvolvNex',
}

export default function AppointmentsPage() {
  return (
    <ClientGuard>
      <AppointmentsPageClient initialAppointments={[]} />
    </ClientGuard>
  )
}
