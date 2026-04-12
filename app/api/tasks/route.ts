import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/queries'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.B2C_end_user_id) {
      return NextResponse.json([], { status: 200 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('B2C_end_user_id', currentUser.B2C_end_user_id)
      .eq('is_completed', false)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tasks:', JSON.stringify(error))
      return NextResponse.json([], { status: 200 })
    }

    return NextResponse.json(data || [], { status: 200 })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.B2C_end_user_id) {
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
      .insert({ title: title.trim(), B2C_end_user_id: currentUser.B2C_end_user_id })
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
