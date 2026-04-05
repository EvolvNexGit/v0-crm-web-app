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
import type { Appointment, Entity } from '@/lib/supabase/types'

interface UpcomingAppointmentsProps {
  appointments: (Appointment & { entity: Entity })[]
}

export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-black">Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">No appointments scheduled</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 hover:bg-transparent">
                  <TableHead className="text-gray-700 font-semibold">Customer</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Date & Time</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                  <TableHead className="text-gray-700 font-semibold">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.slice(0, 5).map((appointment) => (
                  <TableRow key={appointment.id} className="border-gray-100 hover:bg-gray-100 cursor-pointer transition-all duration-300 hover:scale-101">
                    <TableCell className="font-medium text-black">{appointment.entity?.name}</TableCell>
                    <TableCell className="text-gray-700">
                      {new Date(appointment.date_time).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          appointment.status === 'Completed'
                            ? 'default'
                            : appointment.status === 'Cancelled'
                              ? 'destructive'
                              : 'secondary'
                        }
                        className={
                          appointment.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : appointment.status === 'Cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {appointment.notes ? appointment.notes.substring(0, 50) : '-'}
                    </TableCell>
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
