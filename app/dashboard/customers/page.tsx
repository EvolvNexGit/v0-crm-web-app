import { getCustomers } from '@/lib/supabase/queries'
import { CustomersPageClient } from './page-client'

export const metadata = {
  title: 'Customers - EvolvNex',
}

export default async function CustomersPage() {
  const customers = await getCustomers()
  return <CustomersPageClient initialCustomers={customers} />
}
