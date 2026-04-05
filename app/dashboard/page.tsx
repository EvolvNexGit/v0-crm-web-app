import { getDashboardStats, getAppointments, getEntities } from '@/lib/supabase/queries'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments'
import { RecentCustomers } from '@/components/dashboard/RecentCustomers'
import { LeadsChart, AppointmentsChart } from '@/components/dashboard/AnalyticsCharts'
import { ActivityFeed, type ActivityItem } from '@/components/dashboard/ActivityFeed'
import { TasksList, type Task } from '@/components/dashboard/TasksList'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { Bell, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Dashboard - EvolvNex CRM',
  description: 'Your premium CRM dashboard',
}

export default async function DashboardPage() {
  const [stats, appointments, customers] = await Promise.all([
    getDashboardStats(),
    getAppointments(10),
    getEntities(),
  ])

  // Mock data for charts - replace with real data from your backend
  const leadsChartData = [
    { date: 'Mon', leads: 12 },
    { date: 'Tue', leads: 19 },
    { date: 'Wed', leads: 15 },
    { date: 'Thu', leads: 25 },
    { date: 'Fri', leads: 22 },
    { date: 'Sat', leads: 18 },
    { date: 'Sun', leads: 28 },
  ]

  const appointmentsChartData = [
    { day: 'Mon', appointments: 4 },
    { day: 'Tue', appointments: 3 },
    { day: 'Wed', appointments: 6 },
    { day: 'Thu', appointments: 5 },
    { day: 'Fri', appointments: 7 },
    { day: 'Sat', appointments: 2 },
    { day: 'Sun', appointments: 1 },
  ]

  // Mock activities - replace with real data from your backend
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'new_lead',
      title: 'New lead added',
      description: 'John Smith was added as a new lead',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Appointment scheduled',
      description: 'Meeting with Acme Corp scheduled for tomorrow',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: '3',
      type: 'call',
      title: 'Call completed',
      description: 'Call with Sarah Johnson completed',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
  ]

  // Mock tasks - replace with real data from your backend
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Follow up with prospect',
      customer: 'Tech Solutions Inc',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      priority: 'high',
      completed: false,
    },
    {
      id: '2',
      title: 'Send proposal',
      customer: 'Creative Agency Ltd',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      priority: 'high',
      completed: false,
    },
    {
      id: '3',
      title: 'Schedule demo call',
      customer: 'Global Enterprises',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      completed: false,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">EvolvNex</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">CRM Platform</p>
          </div>
          <div className="flex-1 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-black">Dashboard</h2>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-black hover:bg-gray-100 hover:scale-110 transition-all duration-300 active:scale-95"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-black hover:bg-gray-100 hover:scale-110 transition-all duration-300 active:scale-95"
            >
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>

        {/* KPI Cards */}
        <div>
          <StatsCards
            totalCustomers={stats.totalCustomers}
            todayAppointments={stats.todayAppointments}
            recentAdditions={stats.recentAdditions}
            conversionRate={24.5}
            customerTrend={12}
            appointmentTrend={8}
            conversionTrend={5}
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-8 md:grid-cols-2">
          <LeadsChart data={leadsChartData} />
          <AppointmentsChart data={appointmentsChartData} />
        </div>

        {/* Main Grid - Recent Data & Tasks */}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <UpcomingAppointments appointments={appointments} />
          </div>
          <div>
            <TasksList tasks={tasks} />
          </div>
        </div>

        {/* Activity & Customers */}
        <div className="grid gap-8 md:grid-cols-2">
          <ActivityFeed activities={activities} />
          <RecentCustomers customers={customers} />
        </div>
      </div>
    </div>
  )
}
