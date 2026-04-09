'use client'

import { useState, useEffect } from 'react'
import { KPICard } from '@/components/dashboard/KPICard'
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments'
import { PendingTasks } from '@/components/dashboard/PendingTasks'
import { Calendar, CheckCircle, Clock, CalendarDays } from 'lucide-react'
import type { AppointmentWithClient, Task } from '@/lib/supabase/types'

interface DashboardStats {
  total: number
  pending: number
  confirmed: number
  thisMonth: number
}

export function DashboardClient() {
  const [stats, setStats] = useState<DashboardStats>({ total: 0, pending: 0, confirmed: 0, thisMonth: 0 })
  const [appointments, setAppointments] = useState<AppointmentWithClient[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchStats(), fetchAppointments(), fetchTasks()]).finally(() => setLoading(false))
  }, [])

  async function fetchStats() {
    try {
      const res = await fetch('/api/dashboard/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch { /* silently fail */ }
  }

  async function fetchAppointments() {
    try {
      const res = await fetch('/api/appointments')
      if (res.ok) {
        const response = await res.json()
        const today = new Date().toISOString().split('T')[0]
        const upcoming = (response?.data || []).filter(
          (a: AppointmentWithClient) =>
            a.date >= today && ['tentative', 'booked'].includes(a.status)
        ).slice(0, 5)
        setAppointments(upcoming)
      }
    } catch { /* silently fail */ }
  }

  async function fetchTasks() {
    try {
      const res = await fetch('/api/tasks')
      if (res.ok) {
        const data = await res.json()
        setTasks(data || [])
      }
    } catch { /* silently fail */ }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

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
            href="/dashboard/appointments"
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
            <PendingTasks
              tasks={tasks}
              onTaskDone={(id) => setTasks((prev) => prev.filter((t) => t.id !== id))}
              onTaskAdded={fetchTasks}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
