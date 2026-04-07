import { getDashboardStats, getUpcomingAppointments, getTasks } from '@/lib/supabase/queries'
import { KPICard } from '@/components/dashboard/KPICard'
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments'
import { PendingTasks } from '@/components/dashboard/PendingTasks'
import { Calendar, CheckCircle, Clock, CalendarDays } from 'lucide-react'

export const metadata = {
  title: 'Dashboard - EvolvNex',
}

export default async function DashboardPage() {
  const [stats, appointments, tasks] = await Promise.all([
    getDashboardStats(),
    getUpcomingAppointments(5),
    getTasks(),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <KPICard
            title="Total Bookings"
            value={stats.total}
            icon={<Calendar className="h-5 w-5" />}
            subtitle="All appointments"
          />
          <KPICard
            title="Pending"
            value={stats.pending}
            icon={<Clock className="h-5 w-5" />}
            subtitle="Awaiting confirmation"
          />
          <KPICard
            title="Confirmed Today"
            value={stats.confirmed}
            icon={<CheckCircle className="h-5 w-5" />}
            subtitle="Confirmed"
          />
          <KPICard
            title="This Month"
            value={stats.thisMonth}
            icon={<CalendarDays className="h-5 w-5" />}
            subtitle="Total bookings"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <UpcomingAppointments appointments={appointments} />
          </div>
          <div>
            <PendingTasks initialTasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  )
}
