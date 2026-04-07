'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'
import type { AppointmentWithClient } from '@/lib/supabase/types'

interface UpcomingAppointmentsProps {
  appointments: AppointmentWithClient[]
}

export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  function statusBadge(status: string) {
    switch (status) {
      case 'tentative':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case 'booked':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-black">Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Calendar className="h-10 w-10 mx-auto mb-2" />
            <p className="text-sm">No upcoming appointments</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100 hover:bg-transparent">
                  <TableHead className="text-gray-700 font-semibold">Date</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Time</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Name</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Service</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="text-sm text-gray-700">{appointment.date || '-'}</TableCell>
                    <TableCell className="text-sm text-gray-700">{appointment.start_time || '-'}</TableCell>
                    <TableCell className="font-medium text-black">{appointment.name || '-'}</TableCell>
                    <TableCell className="text-sm text-gray-700">{appointment.service || '-'}</TableCell>
                    <TableCell>{statusBadge(appointment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
