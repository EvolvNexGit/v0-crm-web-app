import { getAppointments } from '@/lib/supabase/queries'
import { AppointmentsPageClient } from './page-client'

export const metadata = {
  title: 'Appointments - EvolvNex',
}

export default async function AppointmentsPage() {
  const appointments = await getAppointments()
  return <AppointmentsPageClient initialAppointments={appointments} />
}
