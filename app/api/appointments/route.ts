import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/queries'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser?.client_id) {
      console.log('[appointments API] No user or client_id found')
      return NextResponse.json({ data: [], debug: 'no-user-or-tenant' }, { status: 200 })
    }

    const supabase = await createClient()

    console.log('[appointments API] Fetching for client_id:', currentUser.client_id)

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('client_id', currentUser.client_id)
      .order('date', { ascending: false })
      .order('start_time', { ascending: false })

    if (error) {
      console.error('[appointments API] Supabase error:', JSON.stringify(error))
      return NextResponse.json({ data: [], debug: error.message }, { status: 500 })
    }

    console.log('[appointments API] Found', data?.length || 0, 'appointments')
    return NextResponse.json({ data: data || [], debug: { client_id: currentUser.client_id, count: data?.length || 0 } }, { status: 200 })
  } catch (error: any) {
    console.error('[appointments API] Error:', error)
    return NextResponse.json({ data: [], debug: error?.message || 'unexpected-error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.client_id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const supabase = await createClient()

    console.log('[appointments API POST] Creating appointment for client:', currentUser.client_id)

    const { data, error } = await supabase
      .from('appointments')
      .insert({ ...body, client_id: currentUser.client_id })
      .select()
      .single()

    if (error) {
      console.error('[appointments API POST] Error:', JSON.stringify(error))
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    console.log('[appointments API POST] Created appointment:', data.id)
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('[appointments API POST] Error:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to create appointment' },
      { status: 500 }
    )
  }
}
