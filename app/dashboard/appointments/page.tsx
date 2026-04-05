import { getAppointments, getEntities } from '@/lib/supabase/queries'
import { AppointmentsPageClient } from './page-client'

export const metadata = {
  title: 'Appointments - EvolvNex CRM',
  description: 'Manage your appointments',
}

export default async function AppointmentsPage() {
  const [appointments, customers] = await Promise.all([
    getAppointments(),
    getEntities(),
  ])

  return (
    <AppointmentsPageClient
      initialAppointments={appointments}
      customers={customers}
    />
  )
}
