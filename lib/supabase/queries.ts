import { createClient } from './server'
import type { Entity, Appointment, User } from './types'

/**
 * Get the current user's session and tenant information
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  // Get user record from database to get tenant_id
  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return null
  }

  return {
    ...user,
    tenant_id: userData?.tenant_id,
  }
}

/**
 * Get all entities (customers) for the current tenant
 */
export async function getEntities(search?: string) {
  const supabase = await createClient()
  const currentUser = await getCurrentUser()

  if (!currentUser?.tenant_id) {
    return []
  }

  let query = supabase
    .from('entities')
    .select('*')
    .eq('tenant_id', currentUser.tenant_id)
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching entities:', error)
    return []
  }

  return data as Entity[]
}

/**
 * Get a single entity by ID
 */
export async function getEntity(id: string) {
  const supabase = await createClient()
  const currentUser = await getCurrentUser()

  if (!currentUser?.tenant_id) {
    return null
  }

  const { data, error } = await supabase
    .from('entities')
    .select('*')
    .eq('id', id)
    .eq('tenant_id', currentUser.tenant_id)
    .single()

  if (error) {
    console.error('Error fetching entity:', error)
    return null
  }

  return data as Entity
}

/**
 * Create a new entity (customer)
 */
export async function createEntity(entity: Omit<Entity, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  const currentUser = await getCurrentUser()

  if (!currentUser?.tenant_id) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('entities')
    .insert([
      {
        ...entity,
        tenant_id: currentUser.tenant_id,
      },
    ])
    .select()

  if (error) {
    console.error('Error creating entity:', error)
    throw error
  }

  return data[0] as Entity
}

/**
 * Get all appointments for the current tenant
 */
export async function getAppointments(limit?: number) {
  const supabase = await createClient()
  const currentUser = await getCurrentUser()

  if (!currentUser?.tenant_id) {
    return []
  }

  let query = supabase
    .from('appointments')
    .select(`
      *,
      entity:entities(*)
    `)
    .eq('tenant_id', currentUser.tenant_id)
    .order('date_time', { ascending: true })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching appointments:', error)
    return []
  }

  return data as (Appointment & { entity: Entity })[]
}

/**
 * Create a new appointment
 */
export async function createAppointment(appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  const currentUser = await getCurrentUser()

  if (!currentUser?.tenant_id) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert([
      {
        ...appointment,
        tenant_id: currentUser.tenant_id,
      },
    ])
    .select()

  if (error) {
    console.error('Error creating appointment:', error)
    throw error
  }

  return data[0] as Appointment
}

/**
 * Get dashboard statistics for the current tenant
 */
export async function getDashboardStats() {
  const supabase = await createClient()
  const currentUser = await getCurrentUser()

  if (!currentUser?.tenant_id) {
    return {
      totalCustomers: 0,
      todayAppointments: 0,
      recentAdditions: 0,
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split('T')[0]

  const [
    { count: customersCount },
    { count: appointmentsCount },
    { count: recentCount },
  ] = await Promise.all([
    supabase
      .from('entities')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', currentUser.tenant_id),
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', currentUser.tenant_id)
      .gte('date_time', todayStr)
      .lt('date_time', new Date(today.getTime() + 86400000).toISOString()),
    supabase
      .from('entities')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', currentUser.tenant_id)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
  ])

  return {
    totalCustomers: customersCount || 0,
    todayAppointments: appointmentsCount || 0,
    recentAdditions: recentCount || 0,
  }
}
