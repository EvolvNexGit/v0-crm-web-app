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
      .from('appointments')
      .update({
        status: 'booked',
        verified_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('Error confirming appointment:', JSON.stringify(error))
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error confirming appointment:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to confirm appointment' },
      { status: 500 }
    )
  }
}
