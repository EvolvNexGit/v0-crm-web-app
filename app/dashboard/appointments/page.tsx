import { AppointmentsPageClient } from './page-client'
import { getAppointments } from '@/lib/supabase/queries'

export const metadata = {
  title: 'Appointments - EvolvNex',
}

export default async function AppointmentsPage() {
  const appointments = await getAppointments()

  return <AppointmentsPageClient initialAppointments={appointments} />
}
