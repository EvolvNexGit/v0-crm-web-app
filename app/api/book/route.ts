import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      B2C_end_user_id,
      client_id,
      name,
      phone,
      email,
      service,
      location,
      staff_name,
      date,
      start_time,
      end_time,
      remark,
    } = body

    if (!B2C_end_user_id || !date || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient()

    const { error } = await supabase.from('appointments').insert([
      {
        B2C_end_user_id,
        client_id: client_id || null,
        name,
        phone: phone || null,
        email: email || null,
        service: service || null,
        location: location || null,
        staff_name: staff_name || null,
        date,
        start_time: start_time || null,
        end_time: end_time || null,
        remark: remark || null,
        status: 'tentative',
      },
    ])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 })
  }
}
