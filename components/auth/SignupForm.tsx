'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import Link from 'next/link'
import { Spinner } from '@/components/ui/spinner'

export function SignupForm() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [tenantName, setTenantName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Sign up the user
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            tenant_name: tenantName,
          },
        },
      })

      if (signupError) {
        setError(signupError.message)
        return
      }

      if (!data.user) {
        setError('Failed to create account')
        return
      }

      // Create tenant
      const { error: tenantError } = await supabase.from('tenants').insert([
        {
          name: tenantName,
        },
      ])

      if (tenantError) {
        setError('Failed to create tenant')
        return
      }

      // Get the tenant ID
      const { data: tenants } = await supabase
        .from('tenants')
        .select('id')
        .eq('name', tenantName)
        .single()

      if (!tenants) {
        setError('Failed to retrieve tenant')
        return
      }

      // Create user record
      const { error: userError } = await supabase.from('users').insert([
        {
          id: data.user.id,
          email,
          B2C_end_user_id: tenants.id,
        },
      ])

      if (userError) {
        setError('Failed to create user record')
        return
      }

      // Redirect to login
      router.push('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create EvolvNex Account</CardTitle>
        <CardDescription>
          Set up your CRM account and get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="tenant">Organization Name</FieldLabel>
            <Input
              id="tenant"
              type="text"
              placeholder="Your Company"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              required
              disabled={loading}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </Field>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
