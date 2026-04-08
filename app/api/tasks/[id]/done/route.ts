import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    if (!id) {
      return NextResponse.json({ message: 'Invalid task ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('tasks')
      .update({ is_completed: true })
      .eq('id', id)

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
