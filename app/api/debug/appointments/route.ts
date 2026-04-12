import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/queries'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser?.client_id) {
      return NextResponse.json(
        {
          user_id: currentUser?.id ?? null,
          client_id: null,
          appointment_count: 0,
          debug: 'no-user-or-client',
        },
        { status: 200 }
      )
    }

    const supabase = await createClient()
    const { count, error } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', currentUser.client_id)

    if (error) {
      return NextResponse.json(
        {
          user_id: currentUser.id,
          client_id: currentUser.client_id,
          appointment_count: 0,
          debug: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        user_id: currentUser.id,
        client_id: currentUser.client_id,
        appointment_count: count ?? 0,
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      {
        user_id: null,
        client_id: null,
        appointment_count: 0,
        debug: error?.message || 'unexpected-error',
      },
      { status: 500 }
    )
  }
}
