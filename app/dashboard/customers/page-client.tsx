'use client'

import { useState } from 'react'
import { CustomersTable } from '@/components/customers/CustomersTable'
import { AddCustomerModal } from '@/components/customers/AddCustomerModal'
import type { Entity } from '@/lib/supabase/types'

interface CustomersPageProps {
  initialCustomers: Entity[]
}

export function CustomersPageClient({ initialCustomers }: CustomersPageProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-2">Manage your customer database</p>
        </div>

        <CustomersTable
          initialCustomers={initialCustomers}
          onAddClick={() => setModalOpen(true)}
        />
      </div>

      <AddCustomerModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}
