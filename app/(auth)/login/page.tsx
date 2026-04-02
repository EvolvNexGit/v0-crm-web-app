import { LoginForm } from '@/components/auth/LoginForm'

export const metadata = {
  title: 'Login - EvolvNex CRM',
  description: 'Sign in to your EvolvNex CRM account',
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full">
        <LoginForm />
      </div>
    </main>
  )
}
