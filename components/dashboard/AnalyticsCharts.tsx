'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface LeadsChartProps {
  data: Array<{
    date: string
    leads: number
  }>
}

interface AppointmentsChartProps {
  data: Array<{
    day: string
    appointments: number
  }>
}

export function LeadsChart({ data }: LeadsChartProps) {
  return (
    <Card className="border border-gray-200 hover:shadow-lg hover:scale-102 transition-all duration-300 cursor-pointer">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-black">Leads Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="leads"
              stroke="#DC2626"
              strokeWidth={2}
              dot={{ fill: '#DC2626', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function AppointmentsChart({ data }: AppointmentsChartProps) {
  return (
    <Card className="border border-gray-200 hover:shadow-lg hover:scale-102 transition-all duration-300 cursor-pointer">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-black">Appointments This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="appointments" fill="#DC2626" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
