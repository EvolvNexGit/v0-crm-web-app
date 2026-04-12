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

    let client: { id: string } | null = null
    let error: { message: string } | null = null

    try {
      const admin = createAdminClient()
      const adminResult = await admin
        .from('clients')
        .select('id')
        .eq('crm_user_id', user.id)
        .maybeSingle()

      client = adminResult.data
      error = adminResult.error
    } catch {
      const fallbackResult = await supabase
        .from('clients')
        .select('id')
        .eq('crm_user_id', user.id)
        .maybeSingle()

      client = fallbackResult.data
      error = fallbackResult.error
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403 })
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

    let existing: { id: string } | null = null
    let existingError: { message: string } | null = null
    let useFallback = false

    try {
      const admin = createAdminClient()
      const adminExisting = await admin
        .from('clients')
        .select('id')
        .eq('crm_user_id', user.id)
        .maybeSingle()
      existing = adminExisting.data
      existingError = adminExisting.error
    } catch {
      useFallback = true
      const fallbackExisting = await supabase
        .from('clients')
        .select('id')
        .eq('crm_user_id', user.id)
        .maybeSingle()
      existing = fallbackExisting.data
      existingError = fallbackExisting.error
    }

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 403 })
    }

    if (existing?.id) {
      return NextResponse.json({ client_id: existing.id }, { status: 200 })
    }

    const createResult = useFallback
      ? await supabase
          .from('clients')
          .insert({ name: name.trim(), crm_user_id: user.id })
          .select('id')
          .single()
      : await createAdminClient()
          .from('clients')
          .insert({ name: name.trim(), crm_user_id: user.id })
          .select('id')
          .single()

    const created = createResult.data
    const createError = createResult.error

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 403 })
    }

    return NextResponse.json({ client_id: created.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create client mapping' },
      { status: 500 },
    )
  }
}
