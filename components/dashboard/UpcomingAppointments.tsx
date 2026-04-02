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
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No appointments scheduled</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.slice(0, 5).map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">{appointment.entity?.name}</TableCell>
                  <TableCell>
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
                    >
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {appointment.notes ? appointment.notes.substring(0, 50) : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
