'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'
import { Flame, Star, Zap } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const { signInAsGuest } = useAuth()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  const handleGuestMode = () => {
    signInAsGuest()
    router.push('/dashboard')
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) { toast.error(error.message); return }
      if (data?.user) {
        await supabase.from('profiles').insert([{ id: data.user.id, email, full_name: fullName }])
        toast.success('Account created!')
        router.push('/dashboard')
      }
    } catch { toast.error('An error occurred') }
    finally { setLoading(false) }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/onboarding` },
      })
      if (error) toast.error(error.message)
    } catch { toast.error('An error occurred') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">

        {/* Hero block */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-primary border-2 border-border rounded-xl px-4 py-1.5 mb-2"
            style={{ boxShadow: '3px 3px 0 #2D3436' }}>
            <Flame className="w-4 h-4 text-primary-foreground" />
            <span className="font-black text-primary-foreground text-sm">CRUMBO</span>
          </div>
          <h1 className="text-3xl font-black text-foreground">Stack your crumbs.</h1>
          <p className="text-muted-foreground font-semibold text-sm">Turn daily study sessions into visible progress.</p>
        </div>

        {/* Perks row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Flame, label: 'Streaks',   color: 'bg-destructive text-destructive-foreground' },
            { icon: Star,  label: 'XP & Levels', color: 'bg-primary text-primary-foreground' },
            { icon: Zap,   label: 'Lock-In',   color: 'bg-accent text-accent-foreground' },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className={`game-card ${color} p-3 flex flex-col items-center gap-1 text-center`}>
              <Icon className="w-5 h-5" />
              <span className="text-xs font-bold">{label}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="game-card p-6 space-y-4">
          <h2 className="font-black text-lg">Create your account</h2>
          <form onSubmit={handleSignup} className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-bold">Full Name</label>
              <Input className="border-2 border-border font-semibold" placeholder="Your name"
                value={fullName} onChange={e => setFullName(e.target.value)} disabled={loading} required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold">Email</label>
              <Input className="border-2 border-border font-semibold" type="email" placeholder="your@email.com"
                value={email} onChange={e => setEmail(e.target.value)} disabled={loading} required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold">Password</label>
              <Input className="border-2 border-border font-semibold" type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} disabled={loading} required />
            </div>
            <button type="submit" disabled={loading}
              className="game-btn w-full py-3 bg-primary text-primary-foreground text-sm">
              {loading ? 'Creating account...' : 'Create Account — Free'}
            </button>
          </form>

          <div className="relative flex items-center">
            <div className="flex-1 border-t-2 border-border" />
            <span className="mx-3 text-xs font-bold text-muted-foreground">or</span>
            <div className="flex-1 border-t-2 border-border" />
          </div>

          <button onClick={handleGoogleSignUp} disabled={loading}
            className="game-btn w-full py-3 bg-card text-foreground text-sm">
            Continue with Google
          </button>

          <button onClick={handleGuestMode} disabled={loading}
            className="w-full py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground border-2 border-dashed border-border rounded-xl transition-colors">
            Explore as Guest
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground font-semibold">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-black hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}
