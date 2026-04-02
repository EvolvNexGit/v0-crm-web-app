"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function SignupPage() {
  const supabase = createClient()
  const router = useRouter()

  const [orgName, setOrgName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // 1. Create auth user
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email,
          password,
        })

      if (authError || !authData.user) {
        throw new Error(authError?.message || "Signup failed")
      }

      const user = authData.user

      // 2. Create tenant
      const { data: tenant, error: tenantError } = await supabase
        .from("tenants")
        .insert([{ name: orgName }])
        .select()
        .single()

      if (tenantError || !tenant) {
        console.error(tenantError)
        throw new Error("Failed to create tenant")
      }

      // 3. Link user to tenant
      const { error: userError } = await supabase.from("users").insert([
        {
          id: user.id, // IMPORTANT
          tenant_id: tenant.id,
          role: "admin",
        },
      ])

      if (userError) {
        console.error(userError)
        throw new Error("Failed to create user record")
      }

      // 4. Redirect
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">
          Create EvolvNex Account
        </h2>

        <input
          type="text"
          placeholder="Organization Name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  )
}