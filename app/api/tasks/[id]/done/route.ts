import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/queries'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.client_id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { id } = await params

    if (!id) {
      return NextResponse.json({ message: 'Invalid task ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('tasks')
      .update({ is_completed: true })
      .eq('id', id)
      .eq('client_id', currentUser.client_id)

    if (error) {
      console.error('Error completing task:', JSON.stringify(error))
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error completing task:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to complete task' },
      { status: 500 }
    )
  }
}
