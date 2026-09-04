import { useState, useEffect, useRef } from 'react'
import { register } from '../services/auth'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import AnimatedBackground from '../components/AnimatedBackground'

const passwordRules = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter (a-z)', test: (p) => /[a-z]/.test(p) },
  { label: 'At least one digit (0-9)', test: (p) => /\d/.test(p) },
  { label: 'Special character (@#$%^&+=!)', test: (p) => /[@#$%^&+=!]/.test(p) },
]

function PasswordStrengthChecker({ password }) {
  if (!password) return null
  return (
    <ul className="mt-2 space-y-1">
      {passwordRules.map((rule, i) => {
        const passed = rule.test(password)
        return (
          <li key={i} className={`flex items-center gap-2 text-xs ${passed ? 'text-[#3F9868] dark:text-[#6FCB99]' : 'text-[#C4514B] dark:text-[#F0928D]'}`}>
            <span>{passed ? '✅' : '❌'}</span>
            {rule.label}
          </li>
        )
      })}
    </ul>
  )
}

export default function Register() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Username availability
  const [usernameStatus, setUsernameStatus] = useState('') // '' | 'checking' | 'available' | 'taken' | 'error'
  const debounceRef = useRef(null)

  const allPasswordRulesPassed = passwordRules.every(r => r.test(password))
  const passwordsMatch = password && confirmPassword && password === confirmPassword

  // ── Debounced username check ──
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameStatus('')
      return
    }

    setUsernameStatus('checking')
    clearTimeout(debounceRef.current)
    
    debounceRef.current = setTimeout(async () => {
  try {
    const res = await api.get(`/auth/check-username?username=${username}`)
    // expects { available: true } or { available: false }
    setUsernameStatus(res.data.available ? 'available' : 'taken')
  } catch {
    setUsernameStatus('error')
  }
}, 500)

    return () => clearTimeout(debounceRef.current)
  }, [username])

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    if (!allPasswordRulesPassed) return setError('Password does not meet all requirements.')
    if (!passwordsMatch) return setError('Passwords do not match.')
    if (usernameStatus === 'taken') return setError('Username is already taken.')
    if (usernameStatus === 'checking') return setError('Please wait for username check to complete.')

    setLoading(true)
    try {
      await register({ username, email, password })
      navigate('/login', { replace: true })
    } catch {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-[#0E7C86]/15 focus:border-[#0E7C86]/60 transition-all duration-200"
  const labelClass = "mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300"

  const usernameStatusUI = {
    checking: { text: '⏳ Checking availability...', color: 'text-slate-400' },
    available: { text: '✅ Username is available', color: 'text-[#3F9868] dark:text-[#6FCB99]' },
    taken:     { text: '❌ Username is already taken', color: 'text-[#C4514B] dark:text-[#F0928D]' },
    error:     { text: '⚠️ Could not verify username', color: 'text-[#C9A24B] dark:text-[#E4C579]' },
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 transition-colors duration-300">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white/75 dark:bg-[#121B2E]/65 backdrop-blur-2xl p-8 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)] border border-black/5 dark:border-white/10">

        <div className="mb-7 text-center">
          <span className="inline-block w-10 h-1 rounded-full bg-[#C9A24B] mb-4" />
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Create your account
          </h2>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-[#C4514B]/10 border border-[#C4514B]/20 px-4 py-2.5 text-sm text-[#C4514B] dark:text-[#F0928D]">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">

          {/* Username with live check */}
          <div>
            <label className={labelClass}>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className={`${inputClass} ${
                usernameStatus === 'available' ? 'border-[#3F9868]/60 focus:ring-[#3F9868]/15' :
                usernameStatus === 'taken'     ? 'border-[#C4514B]/50 focus:ring-[#C4514B]/15' : ''
              }`}
            />
            {/* Live status message */}
            {usernameStatus && (
              <p className={`mt-1 text-xs font-medium ${usernameStatusUI[usernameStatus].color}`}>
                {usernameStatusUI[usernameStatus].text}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" placeholder="Enter email" value={email}
              onChange={e => setEmail(e.target.value)} required className={inputClass} />
          </div>

          {/* Password with strength checker */}
          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={`${inputClass} ${password && (allPasswordRulesPassed ? 'border-[#3F9868]/60 focus:ring-[#3F9868]/15' : 'border-[#C4514B]/50 focus:ring-[#C4514B]/15')}`}
            />
            {/* ✅ Real-time password rules */}
            <PasswordStrengthChecker password={password} />
          </div>

          {/* Confirm Password */}
          <div>
            <label className={labelClass}>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className={`${inputClass} ${confirmPassword && (passwordsMatch ? 'border-[#3F9868]/60 focus:ring-[#3F9868]/15' : 'border-[#C4514B]/50 focus:ring-[#C4514B]/15')}`}
            />
            {confirmPassword && (
              <p className={`mt-1 text-xs font-medium ${passwordsMatch ? 'text-[#3F9868] dark:text-[#6FCB99]' : 'text-[#C4514B] dark:text-[#F0928D]'}`}>
                {passwordsMatch ? '✅ Passwords match' : '❌ Passwords do not match'}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !allPasswordRulesPassed || !passwordsMatch || usernameStatus === 'taken' || usernameStatus === 'checking'}
            className="w-full rounded-xl bg-[#0E7C86] hover:bg-[#0B6971] py-3 text-sm font-semibold text-white shadow-lg shadow-[#0E7C86]/25 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already a user?{' '}
          <span onClick={() => navigate('/login')}
            className="cursor-pointer font-semibold text-[#0E7C86] dark:text-[#7FD0D6] hover:underline underline-offset-2">
            Login
          </span>
        </p>
      </div>
    </div>
  )
}
