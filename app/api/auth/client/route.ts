import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createAdminClient()
    const { data: client, error } = await admin
      .from('clients')
      .select('id')
      .eq('crm_user_id', user.id)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!client?.id) {
      return NextResponse.json({ error: 'No client mapping found' }, { status: 404 })
    }

    return NextResponse.json({ client_id: client.id }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to resolve client' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name } = await request.json()
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Client name is required' }, { status: 400 })
    }

    const admin = createAdminClient()

    const { data: existing, error: existingError } = await admin
      .from('clients')
      .select('id')
      .eq('crm_user_id', user.id)
      .maybeSingle()

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 500 })
    }

    if (existing?.id) {
      return NextResponse.json({ client_id: existing.id }, { status: 200 })
    }

    const { data: created, error: createError } = await admin
      .from('clients')
      .insert({ name: name.trim(), crm_user_id: user.id })
      .select('id')
      .single()

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    return NextResponse.json({ client_id: created.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create client mapping' },
      { status: 500 },
    )
  }
}
