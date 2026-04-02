export type Tenant = {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export type User = {
  id: string
  email: string
  tenant_id: string
  created_at: string
  updated_at: string
}

export type Entity = {
  id: string
  tenant_id: string
  entity_code: string
  name: string
  phone: string
  email: string
  type: 'Individual' | 'Business' | 'Organization'
  created_at: string
  updated_at: string
}

export type Appointment = {
  id: string
  tenant_id: string
  entity_id: string
  appointment_date: string
  appointment_time: string
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled'
  notes: string | null
  created_at: string
  updated_at: string
}

export type EntityWithAppointments = Entity & {
  appointments?: Appointment[]
}
