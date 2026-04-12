import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { user_id, password } = await request.json()

    if (!user_id || !password) {
      return NextResponse.json({ error: 'User ID and password are required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('crm_users')
      .select('user_id, password, client_id')
      .eq('user_id', String(user_id).trim())
      .eq('password', String(password))
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data?.client_id) {
      return NextResponse.json({ error: 'Invalid user ID or password' }, { status: 401 })
    }

    const response = NextResponse.json(
      {
        ok: true,
        user_id: data.user_id,
        client_id: data.client_id,
      },
      { status: 200 },
    )

    response.cookies.set('crm_client_id', String(data.client_id), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    response.cookies.set('crm_user_id', String(data.user_id), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 500 },
    )
  }
}