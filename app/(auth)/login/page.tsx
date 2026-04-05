import { LoginForm } from '@/components/auth/LoginForm'

export const metadata = {
  title: 'Login - EvolvNex CRM',
  description: 'Sign in to your EvolvNex CRM account',
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-black">EvolvNex</h1>
          <p className="text-gray-600 mt-2">Premium CRM Platform</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
