import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { error } = await supabase
      .from('tasks')
      .update({ is_completed: true })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing task:', error)
    return NextResponse.json({ message: 'Failed to complete task' }, { status: 500 })
  }
}
