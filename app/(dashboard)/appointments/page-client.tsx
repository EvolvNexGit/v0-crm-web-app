'use client'

import { useState } from 'react'
import { AppointmentsTable } from '@/components/appointments/AppointmentsTable'
import { AddAppointmentModal } from '@/components/appointments/AddAppointmentModal'
import type { Appointment, Entity } from '@/lib/supabase/types'

interface AppointmentsPageProps {
  initialAppointments: (Appointment & { entity: Entity })[]
  customers: Entity[]
}

export function AppointmentsPageClient({
  initialAppointments,
  customers,
}: AppointmentsPageProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground mt-2">Schedule and manage appointments</p>
        </div>

        <AppointmentsTable
          initialAppointments={initialAppointments}
          onAddClick={() => setModalOpen(true)}
        />
      </div>

      <AddAppointmentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        customers={customers}
      />
    </>
  )
}
