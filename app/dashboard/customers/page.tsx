import { getEntities } from '@/lib/supabase/queries'
import { CustomersPageClient } from './page-client'

export const metadata = {
  title: 'Customers - EvolvNex CRM',
  description: 'Manage your customers',
}

export default async function CustomersPage() {
  const customers = await getEntities()

  return <CustomersPageClient initialCustomers={customers} />
}
