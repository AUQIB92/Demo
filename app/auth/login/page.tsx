"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Loader2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect_to')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setNeedsConfirmation(false)

    const supabase = createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed') || error.message.includes('email_not_confirmed')) {
        setNeedsConfirmation(true)
        setError("Please confirm your email address before signing in. Check your inbox for the confirmation link.")
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (user && !user.email_confirmed_at) {
      await supabase.auth.signOut()
      setNeedsConfirmation(true)
      setError("Please confirm your email address before signing in.")
      setLoading(false)
      return
    }

    let profile: { role?: string } | null = null
    try {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()
      profile = data
    } catch {
      // profiles table may not exist yet
    }

    router.push(redirectTo || (profile?.role === 'admin' ? '/admin' : '/dashboard'))
    router.refresh()
  }

  const handleResendConfirmation = async () => {
    setResending(true)
    const supabase = createClient()
    await supabase.auth.resend({
      type: 'signup',
      email,
    })
    setResent(true)
    setResending(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel rounded-[2rem] p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            {needsConfirmation && (
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-center">
                <Mail className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-sm text-accent font-medium mb-3">Didn&apos;t get the email?</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResendConfirmation}
                  disabled={resending || resent}
                  className="border-accent/30 text-accent"
                >
                  {resending ? (
                    <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Sending...</>
                  ) : resent ? (
                    "Resent! Check your inbox"
                  ) : (
                    "Resend Confirmation"
                  )}
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 rounded-xl bg-secondary/50 border-border/50 text-base sm:text-lg"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-base font-semibold">Password</Label>
                <Link href="/auth/forgot-password" className="text-sm text-accent hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-14 rounded-xl bg-secondary/50 border-border/50 pr-12 text-base sm:text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-base sm:text-lg font-bold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-center text-base sm:text-lg text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-accent font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>}>
      <LoginForm />
    </Suspense>
  )
}