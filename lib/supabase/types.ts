export type Tenant = {
  id: string
  name: string
  industry_type: string
  created_at: string
}

export type User = {
  id: string
  tenant_id: string
  role: string
  created_at: string
}

export type Entity = {
  id: string
  tenant_id: string
  entity_code: string
  name: string
  phone: string
  email: string
  type: string
  created_at: string
}

export type Appointment = {
  id: string
  tenant_id: string
  entity_id: string
  date_time: string
  status: string
  notes: string | null
  created_at: string
}

export type EntityWithAppointments = Entity & {
  appointments?: Appointment[]
}

