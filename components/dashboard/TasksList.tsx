import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react'

export interface Task {
  id: string
  title: string
  customer: string
  dueDate: Date
  priority: 'high' | 'medium' | 'low'
  completed: boolean
}

interface TasksListProps {
  tasks: Task[]
}

const priorityConfig = {
  high: { bg: 'bg-red-50', text: 'text-red-700', label: 'Urgent' },
  medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Medium' },
  low: { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Low' },
}

export function TasksList({ tasks }: TasksListProps) {
  const isOverdue = (date: Date) => new Date() > date
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const incompleteTasks = tasks.filter((t) => !t.completed)
  const highPriorityTasks = incompleteTasks.filter((t) => t.priority === 'high')

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-black">Follow-ups Due</CardTitle>
          {highPriorityTasks.length > 0 && (
            <Badge className="bg-red-600 text-white">
              {highPriorityTasks.length} urgent
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {incompleteTasks.length === 0 ? (
            <p className="text-sm text-gray-500">No pending tasks</p>
          ) : (
            incompleteTasks.slice(0, 5).map((task) => {
              const overdue = isOverdue(task.dueDate)
              const today = isToday(task.dueDate)
              const config = priorityConfig[task.priority]

              return (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    overdue
                      ? 'bg-red-50 border-red-200'
                      : today
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {overdue ? (
                    <AlertCircle className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                  ) : (
                    <Clock className="h-4 w-4 text-gray-600 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-600">{task.customer}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={`text-xs ${config.text}`}>
                        {config.label}
                      </Badge>
                      <span
                        className={`text-xs ${
                          overdue
                            ? 'text-red-600 font-semibold'
                            : 'text-gray-600'
                        }`}
                      >
                        {overdue
                          ? 'Overdue'
                          : today
                            ? 'Today'
                            : task.dueDate.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          {incompleteTasks.length > 5 && (
            <p className="text-xs text-gray-500 text-center pt-2">
              +{incompleteTasks.length - 5} more tasks
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
