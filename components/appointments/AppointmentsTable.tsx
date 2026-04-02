'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Appointment, Entity } from '@/lib/supabase/types'
import { Search } from 'lucide-react'

interface AppointmentsTableProps {
  initialAppointments: (Appointment & { entity: Entity })[]
  onAddClick: () => void
}

export function AppointmentsTable({
  initialAppointments,
  onAddClick,
}: AppointmentsTableProps) {
  const [search, setSearch] = useState('')
  const [appointments] = useState(initialAppointments)

  const filteredAppointments = appointments.filter(
    (apt) =>
      apt.entity?.name.toLowerCase().includes(search.toLowerCase()) ||
      apt.appointment_date.includes(search) ||
      apt.status.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'secondary'
      case 'Completed':
        return 'default'
      case 'Cancelled':
        return 'destructive'
      case 'Rescheduled':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name, date, or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={onAddClick}>Add Appointment</Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {appointments.length === 0
                    ? 'No appointments scheduled. Add one to get started!'
                    : 'No appointments match your search.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">
                    {appointment.entity?.name}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(appointment.appointment_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm">
                    {appointment.appointment_time}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {appointment.notes || '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
