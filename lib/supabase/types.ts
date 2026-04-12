export type Tenant = {
  id: string
  name: string
  industry_type: string
  created_at: string
}

export type User = {
  id: string
  client_id: string
  role: string
  created_at: string
}

export type Person = {
  id: string
  name: string
  phone: string | null
  whatsapp_number: string | null
  email: string | null
  type: 'client_contact' | 'employee' | 'external_referral'
  created_at: string
}

export type Client = {
  id: string
  name: string
  project_name: string | null
  primary_contact_id: string | null
  onboarding_date: string | null
  next_service_date: string | null
  package: string | null
  package_price: number | null
  discount: number | null
  amount_charged: number | null
  base_payment_status: string | null
  payment_date: string | null
  description: string | null
  website_link: string | null
  handover_date: string | null
  is_active: boolean
  created_at: string
}

export type Appointment = {
  id: string
  client_id: string
  name: string | null
  phone: string | null
  email: string | null
  service: string | null
  location: string | null
  staff_name: string | null
  date: string | null
  start_time: string | null
  end_time: string | null
  status: 'tentative' | 'booked' | 'cancelled' | 'completed'
  remark: string | null
  created_by: string | null
  verified_at: string | null
  verified_by: string | null
  reminder_sent: boolean
  reminder_sent_at: string | null
  created_at: string
}

export type Task = {
  id: string
  client_id: string
  title: string
  is_completed: boolean
  created_at: string
}

export type AppointmentWithClient = Appointment & {
  client?: Client
}
