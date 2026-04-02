import { SignupForm } from '@/components/auth/SignupForm'

export const metadata = {
  title: 'Sign Up - EvolvNex CRM',
  description: 'Create a new EvolvNex CRM account',
}

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full">
        <SignupForm />
      </div>
    </main>
  )
}
