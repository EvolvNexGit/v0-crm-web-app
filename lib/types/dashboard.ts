/**
 * Dashboard Component Types
 * Type definitions for dashboard components
 */

export interface KPICardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: number
  trendLabel?: string
  subtitle?: string
}

export interface ChartDataPoint {
  date?: string
  day?: string
  leads?: number
  appointments?: number
  [key: string]: string | number | undefined
}

export interface ActivityItem {
  id: string
  type: 'appointment' | 'call' | 'note' | 'new_lead' | 'message'
  title: string
  description: string
  timestamp: Date
}

export interface Task {
  id: string
  title: string
  customer: string
  dueDate: Date
  priority: 'high' | 'medium' | 'low'
  completed: boolean
}

export interface DashboardStats {
  totalCustomers: number
  todayAppointments: number
  recentAdditions: number
  conversionRate?: number
  revenue?: number
}

export interface QuickActionsProps {
  onAddLead?: () => void
  onBookAppointment?: () => void
  onCreateTask?: () => void
}
