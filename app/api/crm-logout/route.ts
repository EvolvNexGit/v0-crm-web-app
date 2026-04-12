import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ ok: true }, { status: 200 })

  response.cookies.set('crm_client_id', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })

  response.cookies.set('crm_user_id', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })

  return response
}