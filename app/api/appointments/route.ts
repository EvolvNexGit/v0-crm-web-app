import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/queries'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const currentUser = await getCurrentUser()

    if (!currentUser?.tenant_id) {
      return NextResponse.json(
        { message: 'User not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { entity_id, appointment_date, appointment_time, status, notes } = body

    // Validate required fields
    if (!entity_id || !appointment_date || !appointment_time || !status) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify the entity belongs to this tenant
    const { data: entity, error: entityError } = await supabase
      .from('entities')
      .select('id')
      .eq('id', entity_id)
      .eq('tenant_id', currentUser.tenant_id)
      .single()

    if (entityError || !entity) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      )
    }

    // Create the appointment
    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          tenant_id: currentUser.tenant_id,
          entity_id,
          appointment_date,
          appointment_time,
          status,
          notes: notes || null,
        },
      ])
      .select()

    if (error) {
      console.error('Error creating appointment:', error)
      return NextResponse.json(
        { message: 'Failed to create appointment' },
        { status: 500 }
      )
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/appointments:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
