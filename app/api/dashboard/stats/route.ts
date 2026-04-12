import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentUser } from '@/lib/supabase/queries'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.B2C_end_user_id) {
      return NextResponse.json({ total: 0, pending: 0, confirmed: 0, thisMonth: 0 })
    }

    const supabase = createAdminClient()

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

    return NextResponse.json({
      total: total || 0,
      pending: pending || 0,
      confirmed: confirmed || 0,
      thisMonth: thisMonth || 0,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ total: 0, pending: 0, confirmed: 0, thisMonth: 0 })
  }
}
