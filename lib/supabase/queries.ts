import { createClient } from './server'
import type { Client, Appointment, AppointmentWithClient, Task } from './types'

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const clientId = await getClientId()
  if (!clientId) return null

  return { ...user, client_id: clientId }
}

export async function getClientId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: client, error } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) throw error
  if (!client?.id) {
    throw new Error('No client mapping found for authenticated user')
  }

  return client.id
}

export async function getAppointments() {
  const supabase = await createClient()
  const clientId = await getClientId()
  if (!clientId) return []

  const { data } = await supabase
    .from('appointments')
    .select('*')
    .eq('client_id', clientId)
    .order('date', { ascending: false })
    .order('start_time', { ascending: false })

  return (data || []) as AppointmentWithClient[]
}

export async function createAppointment(appointment: Partial<Appointment>) {
  const supabase = await createClient()
  const clientId = await getClientId()
  if (!clientId) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('appointments')
    .insert({ ...appointment, client_id: clientId })
    .select()
    .single()

  if (error) throw error
  return data as Appointment
}

export async function updateAppointmentStatus(id: string, status: Appointment['status']) {
  const supabase = await createClient()
  const clientId = await getClientId()
  if (!clientId) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('appointments')
    .update({
      status,
      ...(status === 'booked' ? { verified_at: new Date().toISOString() } : {}),
    })
    .eq('id', id)
    .eq('client_id', clientId)

  if (error) throw error
}

export async function deleteAppointment(id: string) {
  const supabase = await createClient()
  const clientId = await getClientId()
  if (!clientId) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id)
    .eq('client_id', clientId)

  if (error) throw error
}

export async function getCustomers() {
  const supabase = await createClient()
  const clientId = await getClientId()
  if (!clientId) return []

  const { data } = await supabase
    .from('appointments')
    .select(`
      id, name, phone, email, created_at
    `)
    .eq('client_id', clientId)
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
  const clientId = await getClientId()
  if (!clientId) return { total: 0, pending: 0, confirmed: 0, thisMonth: 0 }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const today = now.toISOString().split('T')[0]

  const [{ count: total }, { count: pending }, { count: confirmed }, { count: thisMonth }] =
    await Promise.all([
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('client_id', clientId),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('client_id', clientId).eq('status', 'tentative'),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('client_id', clientId).eq('status', 'booked').eq('date', today),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('client_id', clientId).gte('date', startOfMonth),
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
  const clientId = await getClientId()
  if (!clientId) return []

  const today = new Date().toISOString().split('T')[0]

  const { data } = await supabase
    .from('appointments')
    .select('*')
    .eq('client_id', clientId)
    .in('status', ['tentative', 'booked'])
    .gte('date', today)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })
    .limit(limit)

  return (data || []) as AppointmentWithClient[]
}

export async function getTasks() {
  const supabase = await createClient()
  const clientId = await getClientId()
  if (!clientId) return []

  const { data } = await supabase
    .from('tasks')
    .select('*')
    .eq('client_id', clientId)
    .eq('is_completed', false)
    .order('created_at', { ascending: false })

  return (data || []) as Task[]
}

export async function createTask(title: string) {
  const supabase = await createClient()
  const clientId = await getClientId()
  if (!clientId) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('tasks')
    .insert({ title, client_id: clientId })
    .select()
    .single()

  if (error) throw error
  return data as Task
}

export async function completeTask(id: string) {
  const supabase = await createClient()
  const clientId = await getClientId()
  if (!clientId) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('tasks')
    .update({ is_completed: true })
    .eq('id', id)
    .eq('client_id', clientId)

  if (error) throw error
}
