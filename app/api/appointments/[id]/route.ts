import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentUser } from '@/lib/supabase/queries'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser?.B2C_end_user_id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()
    const { id } = await params

    if (!id) {
      return NextResponse.json({ message: 'Invalid appointment ID' }, { status: 400 })
    }

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
      .eq('B2C_end_user_id', currentUser.B2C_end_user_id)

    if (error) {
      console.error('Error deleting appointment:', JSON.stringify(error))
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to delete appointment' },
      { status: 500 }
    )
  }
}
