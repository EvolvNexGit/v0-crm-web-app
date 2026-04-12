import { cookies } from 'next/headers'
import { createAdminClient } from './admin'
import { createClient } from './server'
import type { Client, Appointment, AppointmentWithClient, Task } from './types'

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const clientId = cookieStore.get('crm_client_id')?.value

  if (clientId) {
    return { id: clientId, B2C_end_user_id: clientId }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: appUser } = await supabase
    .from('users')
    .select('B2C_end_user_id')
    .eq('id', user.id)
    .single()

  // Fallback to auth user id for legacy records where B2C_end_user_id == auth.uid().
  return { ...user, B2C_end_user_id: appUser?.B2C_end_user_id ?? user.id }
}

export async function getAppointments() {
  const supabase = createAdminClient()
  const currentUser = await getCurrentUser()
  if (!currentUser?.B2C_end_user_id) return []

  const { data } = await supabase
    .from('appointments')
    .select('*')
    .eq('B2C_end_user_id', currentUser.B2C_end_user_id)
    .order('date', { ascending: false })
    .order('start_time', { ascending: false })

  return (data || []) as AppointmentWithClient[]
}

export async function createAppointment(appointment: Partial<Appointment>) {
  const supabase = createAdminClient()
  const currentUser = await getCurrentUser()
  if (!currentUser?.B2C_end_user_id) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments')
    .insert({ ...appointment, B2C_end_user_id: currentUser.B2C_end_user_id })
    .select()
    .single()

  if (error) throw error
  return data as Appointment
}

export async function updateAppointmentStatus(id: string, status: Appointment['status']) {
  const supabase = createAdminClient()
  const currentUser = await getCurrentUser()

  if (!currentUser?.B2C_end_user_id) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('appointments')
    .update({
      status,
      ...(status === 'booked' ? { verified_at: new Date().toISOString() } : {}),
    })
    .eq('id', id)
    .eq('B2C_end_user_id', currentUser.B2C_end_user_id)

  if (error) throw error
}

export async function deleteAppointment(id: string) {
  const supabase = createAdminClient()
  const currentUser = await getCurrentUser()

  if (!currentUser?.B2C_end_user_id) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id)
    .eq('B2C_end_user_id', currentUser.B2C_end_user_id)

  if (error) throw error
}

export async function getCustomers() {
  const supabase = createAdminClient()
  const currentUser = await getCurrentUser()
  if (!currentUser?.B2C_end_user_id) return []

  const { data } = await supabase
    .from('appointments')
    .select(`
      id, name, phone, email, created_at
    `)
    .eq('B2C_end_user_id', currentUser.B2C_end_user_id)
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
  const supabase = createAdminClient()
  const currentUser = await getCurrentUser()
  if (!currentUser?.B2C_end_user_id) return { total: 0, pending: 0, confirmed: 0, thisMonth: 0 }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const today = now.toISOString().split('T')[0]

  const [{ count: total }, { count: pending }, { count: confirmed }, { count: thisMonth }] =
    await Promise.all([
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('B2C_end_user_id', currentUser.B2C_end_user_id),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('B2C_end_user_id', currentUser.B2C_end_user_id).eq('status', 'tentative'),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('B2C_end_user_id', currentUser.B2C_end_user_id).eq('status', 'booked').eq('date', today),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('B2C_end_user_id', currentUser.B2C_end_user_id).gte('date', startOfMonth),
    ])

  return {
    total: total || 0,
    pending: pending || 0,
    confirmed: confirmed || 0,
    thisMonth: thisMonth || 0,
  }
}

export async function getUpcomingAppointments(limit = 5) {
  const supabase = createAdminClient()
  const currentUser = await getCurrentUser()
  if (!currentUser?.B2C_end_user_id) return []

  const today = new Date().toISOString().split('T')[0]

  const { data } = await supabase
    .from('appointments')
    .select('*')
    .eq('B2C_end_user_id', currentUser.B2C_end_user_id)
    .in('status', ['tentative', 'booked'])
    .gte('date', today)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })
    .limit(limit)

  return (data || []) as AppointmentWithClient[]
}

export async function getTasks() {
  const supabase = createAdminClient()
  const currentUser = await getCurrentUser()
  if (!currentUser?.B2C_end_user_id) return []

  const { data } = await supabase
    .from('tasks')
    .select('*')
    .eq('B2C_end_user_id', currentUser.B2C_end_user_id)
    .eq('is_completed', false)
    .order('created_at', { ascending: false })

  return (data || []) as Task[]
}

export async function createTask(title: string) {
  const supabase = createAdminClient()
  const currentUser = await getCurrentUser()
  if (!currentUser?.B2C_end_user_id) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('tasks')
    .insert({ title, B2C_end_user_id: currentUser.B2C_end_user_id })
    .select()
    .single()

  if (error) throw error
  return data as Task
}

export async function completeTask(id: string) {
  const supabase = createAdminClient()
  const currentUser = await getCurrentUser()

  if (!currentUser?.B2C_end_user_id) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('tasks')
    .update({ is_completed: true })
    .eq('id', id)
    .eq('B2C_end_user_id', currentUser.B2C_end_user_id)

  if (error) throw error
}
