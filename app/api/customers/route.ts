import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/queries'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.tenant_id) {
      return NextResponse.json([], { status: 200 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('appointments')
      .select('id, name, phone, email, created_at')
      .eq('tenant_id', currentUser.tenant_id)
      .not('name', 'is', null)

    if (error) {
      console.error('Error fetching customers:', JSON.stringify(error))
      return NextResponse.json([], { status: 200 })
    }

    if (!data) return NextResponse.json([], { status: 200 })

    const seen = new Set<string>()
    const unique = data.filter((appt: { name: string | null }) => {
      if (!appt.name) return false
      const key = appt.name.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    return NextResponse.json(unique, { status: 200 })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json([], { status: 200 })
  }
}
