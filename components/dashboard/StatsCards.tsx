import { KPICard } from './KPICard'
import { Users, Calendar, TrendingUp, PhoneOff } from 'lucide-react'

interface StatsCardsProps {
  totalCustomers: number
  todayAppointments: number
  recentAdditions: number
  conversionRate?: number
  customerTrend?: number
  appointmentTrend?: number
  conversionTrend?: number
}

export function StatsCards({
  totalCustomers,
  todayAppointments,
  recentAdditions,
  conversionRate = 0,
  customerTrend = 12,
  appointmentTrend = 8,
  conversionTrend = 5,
}: StatsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-4 sm:grid-cols-2">
      <KPICard
        title="Total Customers"
        value={totalCustomers}
        icon={<Users className="h-5 w-5" />}
        trend={customerTrend}
        subtitle="Active customers"
      />

      <KPICard
        title="Today&apos;s Appointments"
        value={todayAppointments}
        icon={<Calendar className="h-5 w-5" />}
        trend={appointmentTrend}
        subtitle="Scheduled today"
      />

      <KPICard
        title="Conversion Rate"
        value={`${conversionRate}%`}
        icon={<TrendingUp className="h-5 w-5" />}
        trend={conversionTrend}
        subtitle="vs last period"
      />

      <KPICard
        title="Follow-ups Due"
        value={recentAdditions}
        icon={<PhoneOff className="h-5 w-5" />}
        trend={-3}
        subtitle="Action required"
      />
    </div>
  )
}
