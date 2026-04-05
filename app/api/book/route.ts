import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role for backend
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      userId,
      entityId,
      tenantId,
      startTime,
      duration = 30,
      type = 'consultation'
    } = body

    const endTime = new Date(
      new Date(startTime).getTime() + duration * 60000
    ).toISOString()

    // 🔥 1. Check conflict
    const { data: hasConflict, error: conflictError } = await supabase.rpc(
      'check_appointment_conflict',
      {
        p_user_id: userId,
        p_start: startTime,
        p_end: endTime
      }
    )

    if (conflictError) throw conflictError

    if (hasConflict) {
      return NextResponse.json(
        { error: 'Time slot already booked' },
        { status: 400 }
      )
    }

    // 🔥 2. Insert appointment
    const { error: insertError } = await supabase.from('appointments').insert([
      {
        tenant_id: tenantId,
        entity_id: entityId,
        assigned_to: userId,
        date_time: startTime,
        duration,
        status: 'scheduled',
        type
      }
    ])

    if (insertError) throw insertError

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}