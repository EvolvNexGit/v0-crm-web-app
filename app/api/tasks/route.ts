import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/queries'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.tenant_id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title } = body

    if (!title?.trim()) {
      return NextResponse.json({ message: 'Title required' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('tasks')
      .insert({ title: title.trim(), tenant_id: currentUser.tenant_id })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', JSON.stringify(error))
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('Error creating task:', error)
    return NextResponse.json({ message: error.message || 'Failed to create task' }, { status: 500 })
  }
}
