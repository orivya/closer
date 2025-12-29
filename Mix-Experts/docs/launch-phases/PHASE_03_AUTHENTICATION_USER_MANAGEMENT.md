# Phase 03: Authentication & User Management

**Priority:** CRITICAL
**Estimated Effort:** 3-4 days
**Dependencies:** Database schema deployed (Phase 01), Supabase configured
**Status:** Not Started

---

## Overview

This phase implements the complete authentication flow for MixExperts, including signup, login, password reset, email verification, session management, and user onboarding. By the end of this phase, users will be able to create accounts, authenticate, and set up their profiles with proper session handling and security measures.

**Key Deliverables:**
- Fully functional signup/login/logout flows
- Email verification and password reset
- Session persistence and refresh handling
- User onboarding with username selection and profile setup
- Protected routes via middleware
- OAuth provider integration (Google)
- Rate limiting and security measures

---

## Stages

### Stage 3.1: Configure Supabase Auth Settings
**Status:** ⬜ Not Started

Configure authentication settings in Supabase Dashboard under Authentication → Settings:

**Email Auth Configuration:**
- ✅ Enable Email provider
- ✅ Enable "Confirm email" (users must verify email before login)
- ✅ Set "Secure email change" to ON
- ✅ Set "Secure password change" to ON

**Password Requirements:**
```
Minimum password length: 8 characters
Require uppercase: Yes
Require lowercase: Yes
Require numbers: Yes
Require special characters: No (optional)
```

**Email Settings:**
- Site URL: `https://mixexperts.com` (production) or `http://localhost:3000` (development)
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://mixexperts.com/auth/callback`

**Session Settings:**
- Session timeout: 604800 (7 days)
- Refresh token rotation: Enabled
- Auto-refresh token: Enabled

**Security Settings:**
- Enable CAPTCHA on signup: Consider enabling for production
- Rate limiting: Configure as needed

**Test:**
- [ ] Verify settings are saved in Supabase Dashboard
- [ ] Test that unauthorized email addresses cannot confirm

---

### Stage 3.2: Set Up Email Templates in Supabase
**Status:** ⬜ Not Started

Customize email templates in Supabase Dashboard → Authentication → Email Templates:

**1. Confirm Signup Email Template:**
```html
<h2>Welcome to MixExperts!</h2>
<p>Thanks for signing up. Click the link below to confirm your email address:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
<p>This link expires in 24 hours.</p>
<p>If you didn't create an account, you can safely ignore this email.</p>
```

**2. Magic Link Email Template:**
```html
<h2>Your MixExperts Login Link</h2>
<p>Click the link below to sign in to your account:</p>
<p><a href="{{ .ConfirmationURL }}">Sign in to MixExperts</a></p>
<p>This link expires in 1 hour.</p>
<p>If you didn't request this, you can safely ignore this email.</p>
```

**3. Reset Password Email Template:**
```html
<h2>Reset Your Password</h2>
<p>Click the link below to reset your MixExperts password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset password</a></p>
<p>This link expires in 1 hour.</p>
<p>If you didn't request a password reset, you can safely ignore this email.</p>
```

**4. Email Change Confirmation Template:**
```html
<h2>Confirm Email Change</h2>
<p>Click the link below to confirm your new email address:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm new email</a></p>
<p>This link expires in 24 hours.</p>
```

**Configuration:**
- Set redirect URL to: `{{ .SiteURL }}/auth/callback`
- Customize sender name: "MixExperts"
- Set reply-to email if different from sender

**Test:**
- [ ] Send test email for each template
- [ ] Verify links work correctly
- [ ] Check email deliverability (inbox vs. spam)

---

### Stage 3.3: Create AuthContext Provider Component
**Status:** ⬜ Not Started

Create `src/contexts/AuthContext.tsx` to manage global authentication state:

```typescript
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface Profile {
  id: string
  username: string
  display_name: string
  email: string
  avatar_url: string | null
  role: 'engineer' | 'artist'
  subscription_tier: 'free' | 'pro' | 'enterprise'
  is_published: boolean
  created_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, metadata: SignUpMetadata) => Promise<void>
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (newPassword: string) => Promise<void>
  refreshProfile: () => Promise<void>
}

interface SignUpMetadata {
  full_name: string
  role: 'engineer' | 'artist'
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch profile data
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setProfile(null)
    }
  }

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Sign up
  const signUp = async (email: string, password: string, metadata: SignUpMetadata) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata.full_name,
          role: metadata.role,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) throw error
  }

  // Sign in
  const signIn = async (email: string, password: string, rememberMe = false) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Handle "remember me" by setting session to localStorage vs sessionStorage
    if (!rememberMe) {
      // Optionally implement shorter session for non-remembered logins
      // This would require custom session management
    }
  }

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
  }

  // Reset password
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) throw error
  }

  // Update password
  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error
  }

  // Refresh profile
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

**Test:**
- [ ] Context provides all expected values
- [ ] Auth state updates on login/logout
- [ ] Profile data loads correctly

---

### Stage 3.4: Implement useAuth Hook with All Methods
**Status:** ⬜ Not Started

The `useAuth` hook is already included in Stage 3.3. Verify it includes:

**Methods:**
- ✅ `signUp(email, password, metadata)` - Register new user
- ✅ `signIn(email, password, rememberMe?)` - Authenticate user
- ✅ `signOut()` - End session
- ✅ `resetPassword(email)` - Request password reset
- ✅ `updatePassword(newPassword)` - Change password
- ✅ `refreshProfile()` - Reload profile data

**State:**
- ✅ `user` - Current Supabase user object
- ✅ `profile` - Current user's profile data
- ✅ `loading` - Auth initialization state

**Test:**
- [ ] All methods callable from components
- [ ] State updates trigger re-renders
- [ ] Error handling works correctly

---

### Stage 3.5: Wire SignupForm to supabase.auth.signUp()
**Status:** ⬜ Not Started

Update `src/components/auth/SignupForm.tsx` to use the AuthContext:

```typescript
'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'engineer' | 'artist'>('engineer')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await signUp(email, password, { full_name: fullName, role })
      // Redirect to email verification page
      router.push('/verify-email')
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Sign up'}
      </button>
    </form>
  )
}
```

**Test:**
- [ ] Signup creates user in Supabase
- [ ] Email confirmation sent
- [ ] Error messages display correctly
- [ ] Redirects to verify-email page

---

### Stage 3.6: Handle Signup Metadata (full_name, role, username)
**Status:** ⬜ Not Started

Ensure metadata is properly captured during signup and stored in the profile via the database trigger (already created in Phase 1):

**Metadata captured:**
- `full_name` - User's display name
- `role` - Either "engineer" or "artist"
- (Username will be set during onboarding)

**Database trigger handles:**
- Creating profile record on `auth.users` insert
- Generating temporary username from email
- Setting display_name from full_name
- Setting role from metadata

**Test:**
- [ ] Metadata appears in `auth.users.raw_user_meta_data`
- [ ] Profile created automatically with correct values
- [ ] Role is properly set

---

### Stage 3.7: Wire LoginForm to supabase.auth.signInWithPassword()
**Status:** ⬜ Not Started

Update `src/components/auth/LoginForm.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await signIn(email, password, rememberMe)
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      if (err.message.includes('Email not confirmed')) {
        setError('Please confirm your email address before logging in.')
      } else if (err.message.includes('Invalid login credentials')) {
        setError('Invalid email or password.')
      } else {
        setError(err.message || 'Failed to sign in')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Email and password inputs */}
      <label>
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        Remember me
      </label>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
```

**Test:**
- [ ] Login works with valid credentials
- [ ] Error messages for invalid credentials
- [ ] Error message if email not verified
- [ ] Redirects to dashboard on success

---

### Stage 3.8: Implement Remember Me Functionality
**Status:** ⬜ Not Started

Supabase handles session persistence automatically via cookies. The "Remember me" option can be used for user preference tracking or custom session duration logic.

**Default Behavior:**
- Supabase stores session in cookies (persistent by default)
- Session auto-refreshes before expiry
- Lasts for configured duration (7 days default)

**Optional Implementation:**
For truly separate "remember me" behavior, you could:

```typescript
// In AuthContext signIn method
const signIn = async (email: string, password: string, rememberMe = false) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  // Store preference in localStorage for UI purposes
  if (rememberMe) {
    localStorage.setItem('rememberMe', 'true')
  } else {
    localStorage.setItem('rememberMe', 'false')
    // Optionally implement auto-logout on browser close
    // This would require additional session management
  }
}
```

**Test:**
- [ ] Session persists after browser refresh
- [ ] Session persists after browser close (if remember me)
- [ ] Session expires after timeout

---

### Stage 3.9: Wire ForgotPasswordForm to supabase.auth.resetPasswordForEmail()
**Status:** ⬜ Not Started

Update `src/components/auth/ForgotPasswordForm.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await resetPassword(email)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="success-message">
        <h3>Check your email</h3>
        <p>We've sent a password reset link to {email}</p>
        <p>The link will expire in 1 hour.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send reset link'}
      </button>
    </form>
  )
}
```

**Test:**
- [ ] Reset email sent successfully
- [ ] Email contains valid reset link
- [ ] Error handling for invalid email
- [ ] Success message displays

---

### Stage 3.10: Implement Reset Password Page with Token Handling
**Status:** ⬜ Not Started

Create `src/app/reset-password/page.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tokenValid, setTokenValid] = useState(false)

  const { updatePassword } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if we have a valid recovery token
  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.includes('access_token')) {
      setTokenValid(true)
    } else {
      setError('Invalid or expired reset link')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await updatePassword(password)
      // Success - redirect to login
      router.push('/login?message=Password updated successfully')
    } catch (err: any) {
      setError(err.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  if (!tokenValid && !error) {
    return <div>Loading...</div>
  }

  if (error && !tokenValid) {
    return (
      <div className="error-page">
        <h2>Invalid Reset Link</h2>
        <p>{error}</p>
        <a href="/forgot-password">Request a new reset link</a>
      </div>
    )
  }

  return (
    <div className="reset-password-page">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          required
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  )
}
```

**Test:**
- [ ] Token validation works
- [ ] Password requirements enforced
- [ ] Password confirmation validation
- [ ] Success redirects to login
- [ ] Expired token shows error

---

### Stage 3.11: Implement Email Verification Page
**Status:** ⬜ Not Started

Create `src/app/verify-email/page.tsx`:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash

    if (hash && hash.includes('access_token')) {
      // User clicked confirmation link
      setStatus('success')
      setMessage('Email verified successfully! Redirecting to onboarding...')

      // Wait 2 seconds then redirect
      setTimeout(() => {
        router.push('/onboarding')
      }, 2000)
    } else {
      // Just showing "check your email" message
      setStatus('verifying')
      setMessage('Please check your email for a verification link.')
    }

    // Listen for auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setStatus('success')
        setMessage('Email verified! Redirecting...')
        setTimeout(() => {
          router.push('/onboarding')
        }, 2000)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  return (
    <div className="verify-email-page">
      {status === 'verifying' && (
        <>
          <h2>Verify Your Email</h2>
          <p>{message}</p>
          <p>Didn't receive an email? Check your spam folder or <a href="#">resend verification</a></p>
        </>
      )}
      {status === 'success' && (
        <>
          <h2>Email Verified!</h2>
          <p>{message}</p>
        </>
      )}
      {status === 'error' && (
        <>
          <h2>Verification Failed</h2>
          <p>{message}</p>
          <a href="/signup">Sign up again</a>
        </>
      )}
    </div>
  )
}
```

**Test:**
- [ ] Shows "check email" message after signup
- [ ] Detects confirmation token in URL
- [ ] Verifies email successfully
- [ ] Redirects to onboarding
- [ ] Handles verification errors

---

### Stage 3.12: Create Onboarding Flow
**Status:** ⬜ Not Started

Update `src/app/onboarding/page.tsx` with multi-step onboarding:

```typescript
'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [role, setRole] = useState<'engineer' | 'artist'>('engineer')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [checkingUsername, setCheckingUsername] = useState(false)

  const { user, refreshProfile } = useAuth()
  const router = useRouter()

  // Check username availability (debounced)
  const checkUsername = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null)
      return
    }

    setCheckingUsername(true)
    try {
      const response = await fetch(`/api/check-username?username=${username}`)
      const data = await response.json()
      setUsernameAvailable(data.available)
    } catch (err) {
      console.error('Error checking username:', err)
    } finally {
      setCheckingUsername(false)
    }
  }

  // Handle avatar upload
  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return null

    const fileExt = avatarFile.name.split('.').pop()
    const fileName = `${user.id}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatarFile, { upsert: true })

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
    return data.publicUrl
  }

  // Complete onboarding
  const handleComplete = async () => {
    setError(null)
    setLoading(true)

    try {
      // Upload avatar if provided
      let avatarUrl = null
      if (avatarFile) {
        avatarUrl = await uploadAvatar()
      }

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: username.toLowerCase(),
          display_name: displayName,
          avatar_url: avatarUrl,
          role,
        })
        .eq('id', user!.id)

      if (updateError) throw updateError

      await refreshProfile()
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="onboarding-page">
      {step === 1 && (
        <div className="step-1">
          <h2>Choose Your Username</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              checkUsername(e.target.value)
            }}
            placeholder="username"
            pattern="[a-z0-9_-]{3,30}"
          />
          {checkingUsername && <span>Checking...</span>}
          {usernameAvailable === true && <span>✓ Available</span>}
          {usernameAvailable === false && <span>✗ Taken</span>}
          <button
            onClick={() => setStep(2)}
            disabled={!usernameAvailable}
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="step-2">
          <h2>Set Your Display Name</h2>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display name"
          />
          <button onClick={() => setStep(3)}>Next</button>
        </div>
      )}

      {step === 3 && (
        <div className="step-3">
          <h2>Upload Profile Picture (Optional)</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
          />
          <button onClick={() => setStep(4)}>Next</button>
          <button onClick={() => setStep(4)}>Skip</button>
        </div>
      )}

      {step === 4 && (
        <div className="step-4">
          <h2>Confirm Your Role</h2>
          <select value={role} onChange={(e) => setRole(e.target.value as 'engineer' | 'artist')}>
            <option value="engineer">Engineer</option>
            <option value="artist">Artist</option>
          </select>
          {error && <div className="error">{error}</div>}
          <button onClick={handleComplete} disabled={loading}>
            {loading ? 'Saving...' : 'Complete Setup'}
          </button>
        </div>
      )}
    </div>
  )
}
```

**Test:**
- [ ] All steps flow correctly
- [ ] Username validation works
- [ ] Avatar upload successful
- [ ] Profile updates in database
- [ ] Redirects to dashboard

---

### Stage 3.13: Implement Username Availability Check API
**Status:** ⬜ Not Started

Create `src/app/api/check-username/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 })
  }

  // Validate username format
  const usernameRegex = /^[a-z0-9_-]{3,30}$/
  if (!usernameRegex.test(username)) {
    return NextResponse.json({
      available: false,
      error: 'Invalid username format'
    }, { status: 400 })
  }

  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username.toLowerCase())
      .single()

    if (error && error.code === 'PGRST116') {
      // Not found - username is available
      return NextResponse.json({ available: true })
    }

    if (data) {
      // Found - username is taken
      return NextResponse.json({ available: false })
    }

    return NextResponse.json({ available: true })
  } catch (error) {
    console.error('Error checking username:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

**Test:**
- [ ] Returns correct availability status
- [ ] Validates username format
- [ ] Handles errors gracefully
- [ ] Case-insensitive check

---

### Stage 3.14: Add Username Validation
**Status:** ⬜ Not Started

Implement client-side validation for username field:

**Requirements:**
- 3-30 characters
- Lowercase letters, numbers, hyphens, underscores only
- No spaces
- Must start with letter or number
- No consecutive special characters

```typescript
// Validation function
const validateUsername = (username: string): { valid: boolean; error?: string } => {
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' }
  }

  if (username.length > 30) {
    return { valid: false, error: 'Username must be 30 characters or less' }
  }

  if (!/^[a-z0-9]/.test(username)) {
    return { valid: false, error: 'Username must start with a letter or number' }
  }

  if (!/^[a-z0-9_-]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain lowercase letters, numbers, hyphens, and underscores' }
  }

  if (/[_-]{2,}/.test(username)) {
    return { valid: false, error: 'Username cannot have consecutive special characters' }
  }

  return { valid: true }
}

// Auto-convert to lowercase
const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value.toLowerCase()
  setUsername(value)

  const validation = validateUsername(value)
  if (!validation.valid) {
    setUsernameError(validation.error)
  } else {
    setUsernameError(null)
    checkUsername(value) // Check availability
  }
}
```

**Test:**
- [ ] All validation rules enforced
- [ ] Error messages clear and helpful
- [ ] Auto-converts to lowercase
- [ ] Real-time validation feedback

---

### Stage 3.15: Wrap App with AuthProvider in layout.tsx
**Status:** ⬜ Not Started

Update `src/app/layout.tsx`:

```typescript
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

**Test:**
- [ ] AuthContext accessible from all pages
- [ ] Auth state persists across navigation
- [ ] No hydration errors

---

### Stage 3.16: Verify Middleware Protects /dashboard/* Routes
**Status:** ⬜ Not Started

The middleware in `src/lib/supabase-middleware.ts` already implements route protection. Verify it works:

**Protected routes:**
- `/dashboard/*` - Requires authentication
- Redirects to `/login` if unauthenticated

**Test:**
- [ ] Unauthenticated users redirected from /dashboard
- [ ] Authenticated users can access /dashboard
- [ ] Session refresh works correctly
- [ ] No infinite redirect loops

---

### Stage 3.17: Verify Middleware Redirects Authenticated Users from /login, /signup
**Status:** ⬜ Not Started

The middleware already implements this. Verify:

**Auth routes:**
- `/login` - Redirects to `/dashboard` if authenticated
- `/signup` - Redirects to `/dashboard` if authenticated

**Test:**
- [ ] Logged-in users redirected from /login
- [ ] Logged-in users redirected from /signup
- [ ] Logged-out users can access /login and /signup

---

### Stage 3.18: Implement Logout Functionality
**Status:** ⬜ Not Started

Add logout button/link to dashboard components:

```typescript
// In Dashboard Header or Settings
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const { signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleLogout} disabled={loading}>
      {loading ? 'Signing out...' : 'Sign out'}
    </button>
  )
}
```

**Test:**
- [ ] Logout clears session
- [ ] Redirects to homepage
- [ ] Auth state updates immediately
- [ ] Can't access /dashboard after logout

---

### Stage 3.19: Add Session Refresh Handling
**Status:** ⬜ Not Started

Supabase handles session refresh automatically, but verify it works:

**Session refresh:**
- Automatic refresh before token expiry
- Handled by `@supabase/ssr` middleware
- No manual intervention needed

**Additional monitoring (optional):**

```typescript
// In AuthContext or root layout
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('Session refreshed')
      }

      if (event === 'SIGNED_OUT') {
        console.log('User signed out')
      }
    }
  )

  return () => subscription.unsubscribe()
}, [])
```

**Test:**
- [ ] Session refreshes before expiry
- [ ] No interruption to user experience
- [ ] Session survives page refresh
- [ ] Expired sessions handled gracefully

---

### Stage 3.20: Implement "Stay Signed In" Option
**Status:** ⬜ Not Started

This is similar to Stage 3.8 (Remember Me). Implement persistent vs. session-only storage:

```typescript
// Option 1: Use Supabase session persistence (default)
// Sessions persist in cookies automatically

// Option 2: Custom implementation for session-only mode
const signIn = async (email: string, password: string, staySignedIn = true) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  if (!staySignedIn) {
    // Set a flag to handle session cleanup on browser close
    sessionStorage.setItem('sessionOnly', 'true')

    // Monitor for window close
    window.addEventListener('beforeunload', async () => {
      if (sessionStorage.getItem('sessionOnly') === 'true') {
        await supabase.auth.signOut()
      }
    })
  } else {
    localStorage.setItem('sessionOnly', 'false')
  }
}
```

**Test:**
- [ ] "Stay signed in" preserves session across browser restarts
- [ ] Session-only mode ends on browser close
- [ ] User preference saved correctly

---

### Stage 3.21: Add OAuth Providers Setup (Google, Optional)
**Status:** ⬜ Not Started

Configure Google OAuth in Supabase Dashboard:

**1. In Supabase Dashboard:**
- Navigate to Authentication → Providers
- Enable Google provider
- Add Google OAuth client ID and secret

**2. Create Google OAuth Credentials:**
- Go to Google Cloud Console
- Create OAuth 2.0 Client ID
- Add authorized redirect URIs:
  - `https://[your-project-ref].supabase.co/auth/v1/callback`
- Copy Client ID and Client Secret to Supabase

**3. Update SignupForm/LoginForm:**

```typescript
// Add Google sign-in button
import { supabase } from '@/lib/supabase'

const handleGoogleSignIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) console.error('Error signing in with Google:', error)
}

// In component
<button onClick={handleGoogleSignIn}>
  <GoogleIcon /> Sign in with Google
</button>
```

**4. Create Auth Callback Handler:**

Create `src/app/auth/callback/route.ts`:

```typescript
import { createServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createServerClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to dashboard or onboarding
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
```

**Test:**
- [ ] Google sign-in button appears
- [ ] Clicking opens Google OAuth flow
- [ ] User data synced to profile
- [ ] Redirects correctly after auth
- [ ] Profile created for OAuth users

---

### Stage 3.22: Create User Profile Sync on Login
**Status:** ⬜ Not Started

Ensure profile data stays in sync with auth data:

```typescript
// In AuthContext or as a database function
const syncProfile = async (user: User) => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    // Profile doesn't exist - create it (should be handled by trigger)
    console.error('Profile not found for user:', user.id)
    return
  }

  // Sync email if changed
  if (profile.email !== user.email) {
    await supabase
      .from('profiles')
      .update({ email: user.email })
      .eq('id', user.id)
  }

  // Sync other OAuth data if needed
  if (user.user_metadata?.avatar_url && !profile.avatar_url) {
    await supabase
      .from('profiles')
      .update({ avatar_url: user.user_metadata.avatar_url })
      .eq('id', user.id)
  }
}

// Call on auth state change
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    await syncProfile(session.user)
  }
})
```

**Test:**
- [ ] Email changes sync to profile
- [ ] OAuth avatar syncs on first login
- [ ] Profile data remains consistent
- [ ] No duplicate profile records

---

### Stage 3.23: Handle Account Deletion Flow
**Status:** ⬜ Not Started

Implement account deletion functionality:

**1. Create API endpoint:**

Create `src/app/api/account/delete/route.ts`:

```typescript
import { createServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check for active subscriptions
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('profile_id', user.id)
      .eq('status', 'active')
      .single()

    if (subscription) {
      return NextResponse.json({
        error: 'Please cancel your subscription before deleting your account'
      }, { status: 400 })
    }

    // Check for active orders
    const { data: activeOrders } = await supabase
      .from('orders')
      .select('*')
      .or(`engineer_id.eq.${user.id},client_id.eq.${user.id}`)
      .in('status', ['pending', 'confirmed', 'in_progress', 'review', 'revision'])

    if (activeOrders && activeOrders.length > 0) {
      return NextResponse.json({
        error: 'Please complete or cancel all active orders before deleting your account'
      }, { status: 400 })
    }

    // Delete user (cascade will handle profile and related records)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)

    if (deleteError) throw deleteError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting account:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

**2. Create UI in Settings:**

```typescript
// In Dashboard Settings page
const [confirmDelete, setConfirmDelete] = useState(false)
const [deleteLoading, setDeleteLoading] = useState(false)

const handleDeleteAccount = async () => {
  if (!confirm('Are you absolutely sure? This action cannot be undone.')) {
    return
  }

  setDeleteLoading(true)
  try {
    const response = await fetch('/api/account/delete', {
      method: 'DELETE',
    })

    const data = await response.json()

    if (!response.ok) {
      alert(data.error)
      return
    }

    // Sign out and redirect
    await signOut()
    router.push('/?message=Account deleted')
  } catch (error) {
    console.error('Error deleting account:', error)
    alert('Failed to delete account')
  } finally {
    setDeleteLoading(false)
  }
}
```

**Test:**
- [ ] Cannot delete with active subscription
- [ ] Cannot delete with pending orders
- [ ] Confirmation dialog works
- [ ] Account and all data deleted
- [ ] User signed out after deletion

---

### Stage 3.24: Add Rate Limiting on Auth Endpoints
**Status:** ⬜ Not Started

Implement rate limiting to prevent abuse:

**Option 1: Supabase Built-in Rate Limiting**
- Supabase has built-in rate limiting on auth endpoints
- Configure in Dashboard → Settings → Rate Limits

**Option 2: Custom Rate Limiting**

Install rate limiting package:
```bash
npm install @upstash/ratelimit @upstash/redis
```

Create rate limiter:

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 requests per 15 minutes
  analytics: true,
})
```

Apply to auth endpoints:

```typescript
// In signup/login API routes or middleware
import { ratelimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'

  const { success, limit, reset, remaining } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        }
      }
    )
  }

  // Continue with auth logic
}
```

**Rate Limits to Configure:**
- Signup: 3 per hour per IP
- Login: 5 per 15 minutes per IP
- Password reset: 3 per hour per email
- Username check: 20 per minute per IP

**Test:**
- [ ] Rate limits enforced correctly
- [ ] Error messages clear
- [ ] Rate limit resets after time window
- [ ] Different endpoints have different limits

---

### Stage 3.25: Test Complete Auth Flow End-to-End
**Status:** ⬜ Not Started

Comprehensive testing of entire authentication system:

**Test Scenarios:**

**1. New User Signup Flow:**
- [ ] Fill out signup form with valid data
- [ ] Submit and receive confirmation email
- [ ] Click confirmation link in email
- [ ] Email verified successfully
- [ ] Redirected to onboarding
- [ ] Complete onboarding (username, avatar, role)
- [ ] Redirected to dashboard
- [ ] Profile data saved correctly

**2. Existing User Login Flow:**
- [ ] Navigate to /login
- [ ] Enter valid credentials
- [ ] Check "Remember me"
- [ ] Successfully logged in
- [ ] Redirected to dashboard
- [ ] Profile data loaded
- [ ] Session persists after browser refresh
- [ ] Session persists after browser restart

**3. Password Reset Flow:**
- [ ] Navigate to /forgot-password
- [ ] Enter email address
- [ ] Receive reset email
- [ ] Click reset link
- [ ] Enter new password
- [ ] Password updated successfully
- [ ] Redirected to login
- [ ] Can log in with new password

**4. OAuth Flow (Google):**
- [ ] Click "Sign in with Google"
- [ ] Google OAuth consent screen appears
- [ ] Authorize application
- [ ] Redirected back to app
- [ ] Profile created automatically
- [ ] User logged in
- [ ] Avatar synced from Google

**5. Protected Routes:**
- [ ] Unauthenticated user visits /dashboard
- [ ] Redirected to /login
- [ ] After login, redirected back to /dashboard
- [ ] Authenticated user visits /login
- [ ] Redirected to /dashboard

**6. Session Management:**
- [ ] Session stays active during use
- [ ] Session refreshes before expiry
- [ ] Expired session prompts re-login
- [ ] Logout clears session immediately
- [ ] Cannot access protected routes after logout

**7. Edge Cases:**
- [ ] Signup with existing email shows error
- [ ] Login with unverified email shows error
- [ ] Login with wrong password shows error
- [ ] Expired reset token shows error
- [ ] Username taken shows error
- [ ] Invalid username format shows error
- [ ] Network errors handled gracefully
- [ ] Rate limits enforced

**8. Security:**
- [ ] Passwords hashed (never visible)
- [ ] Session tokens secure
- [ ] CSRF protection active
- [ ] RLS policies prevent unauthorized access
- [ ] Email verification required
- [ ] Rate limiting prevents brute force

**9. User Experience:**
- [ ] All forms have loading states
- [ ] All errors have clear messages
- [ ] Success messages appear
- [ ] Redirects happen smoothly
- [ ] No flash of wrong content
- [ ] Mobile responsive
- [ ] Keyboard navigation works

**10. Data Integrity:**
- [ ] Profile created on signup
- [ ] Profile data syncs correctly
- [ ] Email changes propagate
- [ ] Username uniqueness enforced
- [ ] Role saved correctly
- [ ] Avatar uploads work

---

## Phase Completion Checklist

Before marking this phase as complete, ensure:

- [ ] All 25 stages completed
- [ ] All tests passing
- [ ] Email templates customized and tested
- [ ] Auth flow documented
- [ ] Rate limiting configured
- [ ] Security audit completed
- [ ] Mobile responsiveness verified
- [ ] Error handling comprehensive
- [ ] Loading states on all forms
- [ ] Success messages clear
- [ ] No console errors
- [ ] No infinite loops or redirects
- [ ] Session management robust
- [ ] OAuth providers working (if enabled)
- [ ] Account deletion flow safe
- [ ] Code reviewed
- [ ] Ready for Phase 04

---

## Notes & Considerations

**Security Best Practices:**
- Never store passwords in plain text
- Always use HTTPS in production
- Enable CAPTCHA for signup in production
- Monitor for suspicious auth activity
- Implement account lockout after failed attempts
- Keep Supabase and dependencies updated

**Performance Optimization:**
- Debounce username availability checks
- Cache profile data appropriately
- Minimize auth state re-renders
- Optimize image uploads (compression)

**User Experience:**
- Clear error messages (avoid technical jargon)
- Helpful hints (password requirements, username rules)
- Smooth transitions between steps
- Mobile-friendly forms
- Accessible (keyboard navigation, screen readers)

**Future Enhancements:**
- Two-factor authentication (2FA)
- Social sign-in with GitHub, Apple
- Passkey/WebAuthn support
- Account recovery phone number
- Login history and device management

---

**Phase 03 Complete!** ✓

Once all stages are checked off, proceed to **Phase 04: Engineer Profile & Portfolio**.
