import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  const cookieStore = await cookies()
  const clientId = cookieStore.get('crm_client_id')?.value

  if (clientId) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }
}
