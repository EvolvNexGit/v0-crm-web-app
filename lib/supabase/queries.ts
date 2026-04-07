import { createClient } from './server'
import type { Client, Appointment, AppointmentWithClient, Task } from './types'

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) return null

  const user = session.user
  return { ...user, tenant_id: user.id }
}

export async function getAppointments() {
  const supabase = await createClient()
  const currentUser = await getCurrentUser()
  if (!currentUser?.tenant_id) return []

  const { data } = await supabase
    .from('appointments')
    .select('*, client:clients(*)')
    .eq('tenant_id', currentUser.tenant_id)
    .order('date', { ascending: false })
    .order('start_time', { ascending: false })

  return (data || []) as AppointmentWithClient[]
}

export async function createAppointment(appointment: Partial<Appointment>) {
  const supabase = await createClient()
  const currentUser = await getCurrentUser()
  if (!currentUser?.tenant_id) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments')
    .insert({ ...appointment, tenant_id: currentUser.tenant_id })
    .select()
    .single()

  if (error) throw error
  return data as Appointment
}

export async function updateAppointmentStatus(id: string, status: Appointment['status']) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('appointments')
    .update({
      status,
      ...(status === 'booked' ? { verified_at: new Date().toISOString() } : {}),
    })
    .eq('id', id)

  if (error) throw error
}

export async function deleteAppointment(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('appointments').delete().eq('id', id)
  if (error) throw error
}

export async function getCustomers() {
  const supabase = await createClient()
  const currentUser = await getCurrentUser()
  if (!currentUser?.tenant_id) return []

  const { data } = await supabase
    .from('appointments')
    .select(`
      id, name, phone, email, created_at
    `)
    .eq('tenant_id', currentUser.tenant_id)
    .not('name', 'is', null)

  if (!data) return []

  const seen = new Set()
  const unique = data.filter((appt) => {
    if (!appt.name) return false
    const key = appt.name.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return unique as Pick<Appointment, 'id' | 'name' | 'phone' | 'email' | 'created_at'>[]
}

export async function getDashboardStats() {
  const supabase = await createClient()
  const currentUser = await getCurrentUser()
  if (!currentUser?.tenant_id) return { total: 0, pending: 0, confirmed: 0, thisMonth: 0 }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const today = now.toISOString().split('T')[0]

  const [{ count: total }, { count: pending }, { count: confirmed }, { count: thisMonth }] =
    await Promise.all([
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('tenant_id', currentUser.tenant_id),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('tenant_id', currentUser.tenant_id).eq('status', 'tentative'),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('tenant_id', currentUser.tenant_id).eq('status', 'booked').eq('date', today),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('tenant_id', currentUser.tenant_id).gte('date', startOfMonth),
    ])

  return {
    total: total || 0,
    pending: pending || 0,
    confirmed: confirmed || 0,
    thisMonth: thisMonth || 0,
  }
}

export async function getUpcomingAppointments(limit = 5) {
  const supabase = await createClient()
  const currentUser = await getCurrentUser()
  if (!currentUser?.tenant_id) return []

  const today = new Date().toISOString().split('T')[0]

  const { data } = await supabase
    .from('appointments')
    .select('*, client:clients(*)')
    .eq('tenant_id', currentUser.tenant_id)
    .in('status', ['tentative', 'booked'])
    .gte('date', today)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })
    .limit(limit)

  return (data || []) as AppointmentWithClient[]
}

export async function getTasks() {
  const supabase = await createClient()
  const currentUser = await getCurrentUser()
  if (!currentUser?.tenant_id) return []

  const { data } = await supabase
    .from('tasks')
    .select('*')
    .eq('tenant_id', currentUser.tenant_id)
    .eq('is_completed', false)
    .order('created_at', { ascending: false })

  return (data || []) as Task[]
}

export async function createTask(title: string) {
  const supabase = await createClient()
  const currentUser = await getCurrentUser()
  if (!currentUser?.tenant_id) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('tasks')
    .insert({ title, tenant_id: currentUser.tenant_id })
    .select()
    .single()

  if (error) throw error
  return data as Task
}

export async function completeTask(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('tasks')
    .update({ is_completed: true })
    .eq('id', id)

  if (error) throw error
}
