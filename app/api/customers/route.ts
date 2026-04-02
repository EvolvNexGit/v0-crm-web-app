import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/queries'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Generate the next entity code (CUST-001, CUST-002, etc.)
 */
async function generateEntityCode(
  supabase: Awaited<ReturnType<typeof createClient>>,
  tenantId: string
) {
  const { data, error } = await supabase
    .from('entities')
    .select('entity_code')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })
    .limit(1)

  if (error || !data || data.length === 0) {
    return 'CUST-001'
  }

  const lastCode = data[0].entity_code
  const match = lastCode.match(/CUST-(\d+)/)
  if (!match) return 'CUST-001'

  const nextNumber = parseInt(match[1], 10) + 1
  return `CUST-${String(nextNumber).padStart(3, '0')}`
}

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
    const { name, email, phone, type } = body

    // Validate required fields
    if (!name || !email || !phone || !type) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate entity code
    const entityCode = await generateEntityCode(supabase, currentUser.tenant_id)

    // Create the entity
    const { data, error } = await supabase
      .from('entities')
      .insert([
        {
          tenant_id: currentUser.tenant_id,
          entity_code: entityCode,
          name,
          email,
          phone,
          type,
        },
      ])
      .select()

    if (error) {
      console.error('Error creating entity:', error)
      return NextResponse.json(
        { message: 'Failed to create customer' },
        { status: 500 }
      )
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/customers:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
