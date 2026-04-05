import { getDashboardStats, getAppointments, getEntities } from '@/lib/supabase/queries'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments'
import { RecentCustomers } from '@/components/dashboard/RecentCustomers'

export const metadata = {
  title: 'Dashboard - EvolvNex CRM',
  description: 'Your CRM dashboard',
}

export default async function DashboardPage() {
  const [stats, appointments, customers] = await Promise.all([
    getDashboardStats(),
    getAppointments(10),
    getEntities(),
  ])

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back to your CRM</p>
      </div>

      <StatsCards
        totalCustomers={stats.totalCustomers}
        todayAppointments={stats.todayAppointments}
        recentAdditions={stats.recentAdditions}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <UpcomingAppointments appointments={appointments} />
        <RecentCustomers customers={customers} />
      </div>
    </div>
  )
}
