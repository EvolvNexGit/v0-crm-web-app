import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Phone, FileText, User, MessageSquare } from 'lucide-react'

export interface ActivityItem {
  id: string
  type: 'appointment' | 'call' | 'note' | 'new_lead' | 'message'
  title: string
  description: string
  timestamp: Date
}

interface ActivityFeedProps {
  activities: ActivityItem[]
}

const activityIcons: Record<ActivityItem['type'], React.ReactNode> = {
  appointment: <Calendar className="h-4 w-4" />,
  call: <Phone className="h-4 w-4" />,
  note: <FileText className="h-4 w-4" />,
  new_lead: <User className="h-4 w-4" />,
  message: <MessageSquare className="h-4 w-4" />,
}

const activityColors: Record<ActivityItem['type'], string> = {
  appointment: 'bg-blue-50 text-blue-700',
  call: 'bg-green-50 text-green-700',
  note: 'bg-purple-50 text-purple-700',
  new_lead: 'bg-yellow-50 text-yellow-700',
  message: 'bg-pink-50 text-pink-700',
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-black">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-gray-500">No activities yet</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-all duration-300 hover:scale-102 hover:shadow-sm">
                <div
                  className={`mt-1 p-2 rounded-lg transition-all duration-300 hover:scale-110 ${activityColors[activity.type]}`}
                >
                  {activityIcons[activity.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black">{activity.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {activity.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
