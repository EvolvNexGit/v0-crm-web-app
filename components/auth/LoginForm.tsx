'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { useClient } from '@/components/auth/ClientContext'

export function LoginForm() {
  const router = useRouter()
  const supabase = createClient()
  const { setClientId } = useClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        setError('Unable to fetch authenticated user')
        return
      }

      const clientResponse = await fetch('/api/auth/client', { method: 'GET' })
      const clientPayload = await clientResponse.json().catch(() => null)

      if (!clientResponse.ok || !clientPayload?.client_id) {
        setError(clientPayload?.error || 'No client mapping found for this user')
        return
      }

      setClientId(clientPayload.client_id)

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full border-gray-200 shadow-lg">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-2xl text-black">Sign in to CRM</CardTitle>
        <CardDescription className="text-gray-600">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-5">
          <Field>
            <FieldLabel htmlFor="email" className="text-black font-medium">Email Address</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="border-gray-300 bg-white text-black placeholder:text-gray-500"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password" className="text-black font-medium">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="border-gray-300 bg-white text-black placeholder:text-gray-500"
            />
          </Field>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              <p className="font-medium">Error</p>
              <p className="mt-1">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-black text-white hover:bg-gray-900 font-medium h-11" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
