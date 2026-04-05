import { Button } from '@/components/ui/button'
import { Plus, Calendar, CheckSquare } from 'lucide-react'

interface QuickActionsProps {
  onAddLead?: () => void
  onBookAppointment?: () => void
  onCreateTask?: () => void
}

export function QuickActions({
  onAddLead,
  onBookAppointment,
  onCreateTask,
}: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={onAddLead}
        className="bg-black text-white hover:bg-gray-900 border border-black hover:scale-110 hover:shadow-lg transition-all duration-300 active:scale-95"
        size="sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Lead
      </Button>
      <Button
        onClick={onBookAppointment}
        variant="outline"
        className="border-black text-black hover:bg-black hover:text-white hover:scale-110 hover:shadow-lg transition-all duration-300 active:scale-95"
        size="sm"
      >
        <Calendar className="h-4 w-4 mr-2" />
        Book Appointment
      </Button>
      <Button
        onClick={onCreateTask}
        variant="outline"
        className="border-black text-black hover:bg-black hover:text-white hover:scale-110 hover:shadow-lg transition-all duration-300 active:scale-95"
        size="sm"
      >
        <CheckSquare className="h-4 w-4 mr-2" />
        Create Task
      </Button>
    </div>
  )
}
