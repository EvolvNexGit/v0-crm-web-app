/**
 * CRM DASHBOARD IMPLEMENTATION GUIDE
 * 
 * This document provides an overview of the modern, premium CRM dashboard
 * built with Next.js, Tailwind CSS, and shadcn/ui
 * 
 * BRAND COLORS:
 * - Black: #000000 (Primary)
 * - Red: #DC2626 (Accent, Highlights)
 * - White: #FFFFFF (Background)
 * 
 * KEY FEATURES:
 * ============
 * 
 * 1. KPI CARDS (components/dashboard/KPICard.tsx)
 *    - Dynamic metrics with trend indicators
 *    - Color-coded trends (green for positive, red for negative)
 *    - Flexible to display any metric
 *    - Props: title, value, icon, trend, trendLabel, subtitle
 * 
 * 2. ANALYTICS CHARTS (components/dashboard/AnalyticsCharts.tsx)
 *    - LeadsChart: Line chart for leads over time
 *    - AppointmentsChart: Bar chart for appointments per day
 *    - Both use Recharts library for interactive visualizations
 *    - Props: data (array of objects)
 * 
 * 3. ACTIVITY FEED (components/dashboard/ActivityFeed.tsx)
 *    - Displays recent system events
 *    - Activity types: appointment, call, note, new_lead, message
 *    - Color-coded by activity type
 *    - Props: activities (ActivityItem[])
 * 
 * 4. TASKS/FOLLOW-UPS (components/dashboard/TasksList.tsx)
 *    - Shows incomplete tasks with priority levels
 *    - Highlights urgent tasks and overdue items
 *    - Priority levels: high, medium, low
 *    - Props: tasks (Task[])
 * 
 * 5. QUICK ACTIONS (components/dashboard/QuickActions.tsx)
 *    - Buttons for common CRM operations
 *    - Add Lead, Book Appointment, Create Task
 *    - Fully customizable with callbacks
 * 
 * 6. ENHANCED STATS CARDS (components/dashboard/StatsCards.tsx)
 *    - Updated to use KPICard component
 *    - Shows 5 key metrics: Total Customers, Appointments, Conversion Rate, Follow-ups, Revenue
 *    - All metrics include trend percentages
 * 
 * 7. TABLES (UpcomingAppointments, RecentCustomers)
 *    - Premium styling with hover effects
 *    - Color-coded badges for status
 *    - Responsive design
 * 
 * INTEGRATION POINTS:
 * ==================
 * 
 * All components are designed to accept dynamic data from your backend:
 * 
 * 1. Dashboard Page (app/dashboard/page.tsx)
 *    - Fetches stats from getDashboardStats()
 *    - Fetches appointments from getAppointments()
 *    - Fetches customers from getEntities()
 * 
 * 2. Mock Data Structure:
 *    - Replace mock data in dashboard/page.tsx with real API calls
 *    - Chart data: { date/day: string, leads/appointments: number }
 *    - Activities: { id, type, title, description, timestamp }
 *    - Tasks: { id, title, customer, dueDate, priority, completed }
 * 
 * 3. To Connect Your Database:
 *    
 *    a) Update lib/supabase/queries.ts with additional queries:
 *       - getActivityFeed(): ActivityItem[]
 *       - getTasksList(): Task[]
 *       - getLeadsChart(): ChartData[]
 *       - getAppointmentsChart(): ChartData[]
 *    
 *    b) Update app/dashboard/page.tsx to fetch real data:
 *       const [stats, appointments, customers, activities, tasks, leadsChart, appointmentsChart] 
 *         = await Promise.all([...])
 *    
 *    c) Pass real data to components instead of mock data
 * 
 * STYLING ARCHITECTURE:
 * ====================
 * 
 * 1. Color System (globals.css):
 *    - Primary: #000000 (Black)
 *    - Accent: #DC2626 (Red) - Used for alerts, highlights, active states
 *    - Neutral: Grays from #f5f5f5 to #1a1a1a
 * 
 * 2. Component Styling:
 *    - Cards: White background with subtle gray borders
 *    - Buttons: Black background with hover effects
 *    - Tables: Light gray hover states
 *    - Icons: Lucide React icons at 16-24px
 * 
 * 3. Interactive Elements:
 *    - Hover states on cards and buttons
 *    - Smooth transitions (0.3s)
 *    - Active sidebar item: Red left border + light red background
 * 
 * RESPONSIVE DESIGN:
 * =================
 * 
 * - Mobile: Single column layout
 * - Tablet (md): 2 columns for most sections
 * - Desktop (lg): Full multi-column layouts
 * - All charts and tables are responsive
 * 
 * KEY COMPONENTS TO CUSTOMIZE:
 * ============================
 * 
 * 1. Dashboard Header (app/dashboard/page.tsx):
 *    - Add user avatar
 *    - Add notification badges
 *    - Add settings dropdown
 * 
 * 2. Quick Actions (components/dashboard/QuickActions.tsx):
 *    - Add onClick handlers to open modals
 *    - Add more action buttons as needed
 * 
 * 3. KPI Cards (components/dashboard/KPICard.tsx):
 *    - Add click handlers for drill-down analytics
 *    - Add sparkline charts for mini trends
 * 
 * 4. Activity Feed & Tasks:
 *    - Add pagination/infinite scroll
 *    - Add filters and search
 *    - Add inline editing for tasks
 * 
 * REMOVED FEATURES:
 * =================
 * 
 * - Signup page: Redirects to login (credentials provided by backend)
 * - Signup link in login form: Removed
 * 
 * PRODUCTION CHECKLIST:
 * ====================
 * 
 * [ ] Replace all mock data with real API calls
 * [ ] Set up error boundaries for chart components
 * [ ] Add loading skeletons for better UX
 * [ ] Implement real-time data refresh with SWR/React Query
 * [ ] Add proper error handling for failed API calls
 * [ ] Set up proper RLS policies in Supabase
 * [ ] Configure chart export functionality
 * [ ] Add user preference settings for dashboard layout
 * [ ] Set up analytics tracking for dashboard usage
 * [ ] Create admin dashboard for system monitoring
 */

export const DASHBOARD_CONFIG = {
  colors: {
    primary: '#000000',
    accent: '#DC2626',
    background: '#ffffff',
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
  },
}
