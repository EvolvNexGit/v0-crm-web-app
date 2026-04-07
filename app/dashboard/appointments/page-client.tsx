'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Search, Calendar, Trash2, Check, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import type { AppointmentWithClient } from '@/lib/supabase/types'

interface AppointmentsPageClientProps {
  initialAppointments: AppointmentWithClient[]
}

export function AppointmentsPageClient({ initialAppointments }: AppointmentsPageClientProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [appointments, setAppointments] = useState(initialAppointments)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    location: '',
    staff_name: '',
    date: '',
    start_time: '',
    end_time: '',
    remark: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const filtered = appointments.filter((a) => {
    const q = search.toLowerCase()
    return (
      a.name?.toLowerCase().includes(q) ||
      a.phone?.includes(q) ||
      a.status.toLowerCase().includes(q) ||
      a.date?.includes(q)
    )
  })

  async function handleConfirm(id: string) {
    setLoadingId(id)
    try {
      const res = await fetch(`/api/appointments/${id}/confirm`, { method: 'POST' })
      if (!res.ok) throw new Error('Failed')
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'booked' as const } : a))
      )
      toast.success('Appointment confirmed')
    } catch {
      toast.error('Failed to confirm')
    } finally {
      setLoadingId(null)
    }
  }

  async function handleDelete(id: string) {
    setLoadingId(id)
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      setAppointments((prev) => prev.filter((a) => a.id !== id))
      toast.success('Appointment deleted')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setLoadingId(null)
      setDeleteId(null)
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status: 'tentative' }),
      })
      if (!res.ok) throw new Error('Failed')
      const newAppt = await res.json()
      setAppointments((prev) => [{ ...newAppt, client: undefined }, ...prev])
      setAddOpen(false)
      setForm({ name: '', phone: '', email: '', service: '', location: '', staff_name: '', date: '', start_time: '', end_time: '', remark: '' })
      toast.success('Appointment added')
      router.refresh()
    } catch {
      toast.error('Failed to add appointment')
    } finally {
      setSubmitting(false)
    }
  }

  function statusBadge(status: string) {
    switch (status) {
      case 'tentative':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case 'booked':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Appointments</h1>
            <p className="text-sm text-gray-500">{appointments.length} bookings</p>
          </div>
          <Button onClick={() => setAddOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, phone, date, or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Time</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Phone</TableHead>
                <TableHead className="font-semibold">Service</TableHead>
                <TableHead className="font-semibold">Staff</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Remark</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                    <Calendar className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    {appointments.length === 0
                      ? 'No appointments yet'
                      : 'No appointments match your search'}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((appt) => (
                  <TableRow key={appt.id} className="hover:bg-gray-50">
                    <TableCell className="text-sm">{appt.date || '-'}</TableCell>
                    <TableCell className="text-sm">{appt.start_time || '-'}</TableCell>
                    <TableCell className="font-medium">{appt.name || '-'}</TableCell>
                    <TableCell className="text-sm">{appt.phone || '-'}</TableCell>
                    <TableCell className="text-sm">{appt.service || '-'}</TableCell>
                    <TableCell className="text-sm">{appt.staff_name || '-'}</TableCell>
                    <TableCell>{statusBadge(appt.status)}</TableCell>
                    <TableCell className="text-sm max-w-32 truncate">{appt.remark || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {appt.status === 'tentative' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => handleConfirm(appt.id)}
                            disabled={loadingId === appt.id}
                          >
                            {loadingId === appt.id ? <Spinner className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                            Confirm
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteId(appt.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Appointment</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">Are you sure you want to delete this appointment? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={!!loadingId}
            >
              {loadingId ? <Spinner className="h-4 w-4 mr-2" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Appointment Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Appointment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Service</label>
                <Input
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Location</label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Staff</label>
                <Input
                  value={form.staff_name}
                  onChange={(e) => setForm({ ...form, staff_name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date *</label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Start Time</label>
                <Input
                  type="time"
                  value={form.start_time}
                  onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">End Time</label>
                <Input
                  type="time"
                  value={form.end_time}
                  onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Remark</label>
              <Textarea
                value={form.remark}
                onChange={(e) => setForm({ ...form, remark: e.target.value })}
                className="mt-1"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Spinner className="h-4 w-4 mr-2" /> : null}
                Add Appointment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
