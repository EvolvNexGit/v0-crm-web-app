'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { CheckCircle2, Plus } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import type { Task } from '@/lib/supabase/types'

interface PendingTasksProps {
  initialTasks: Task[]
}

export function PendingTasks({ initialTasks }: PendingTasksProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      })
      if (!res.ok) throw new Error('Failed')
      const newTask = await res.json()
      setTasks((prev) => [newTask, ...prev])
      setTitle('')
      toast.success('Task added')
    } catch {
      toast.error('Failed to add task')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDone(id: string) {
    setLoadingId(id)
    try {
      const res = await fetch(`/api/tasks/${id}/done`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed')
      setTasks((prev) => prev.filter((t) => t.id !== id))
      toast.success('Task completed')
    } catch {
      toast.error('Failed to complete task')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-black">Pending Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAdd} className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a reminder..."
            required
            className="flex-1"
          />
          <Button type="submit" size="sm" className="gap-1" disabled={submitting}>
            {submitting ? <Spinner className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </form>

        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No pending tasks</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors group"
              >
                <CheckCircle2 className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                <span className="flex-1 text-sm text-gray-700">{task.title}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => handleDone(task.id)}
                  disabled={loadingId === task.id}
                >
                  {loadingId === task.id ? <Spinner className="h-3 w-3" /> : 'Done'}
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
