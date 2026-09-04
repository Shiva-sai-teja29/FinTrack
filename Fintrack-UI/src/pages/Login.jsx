import { useState, useEffect } from 'react'
import { isAuthenticated, login } from '../services/auth'
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

export default function Login() {
  const navigate = useNavigate()

  const [loginType, setLoginType] = useState('username')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [step, setStep] = useState('login') // 'login' | 'forgot' | 'reset'
  const [forgotEmail, setForgotEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    if (isAuthenticated() === true) navigate('/UserDashboard', { replace: true })
  }, [navigate])

  const showMsg = (text, type = 'error') => setMessage({ text, type })

  const allPasswordRulesPassed = passwordRules.every(r => r.test(newPassword))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = loginType === 'username' ? { username, password } : { email, password }
      await login(loginType, payload)
      navigate('/UserDashboard', { replace: true })
    } catch {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!forgotEmail) return showMsg('Please enter your email.')
    setLoading(true)
    try {
      const res = await api.post(`/forgot-password?mail=${forgotEmail}`)
      
      if (res.status === 200) {
        showMsg('Reset token sent to your email!', 'success')
        setStep('reset')
      } else {
        showMsg('Email not found or request failed.')
      }
    } catch {
      showMsg('Server error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!resetToken || !newPassword || !confirmPassword) return showMsg('Please fill all fields.')
    if (!allPasswordRulesPassed) return showMsg('Password does not meet all requirements.')
    if (newPassword !== confirmPassword) return showMsg('Passwords do not match.')
    setLoading(true)
    try {
      const res = await api.post(`/reset-password?token=${resetToken}&newPassword=${newPassword}&mail=${forgotEmail}`)
      if (res.status === 200) {
        showMsg('Password reset successful! Redirecting...', 'success')
        setTimeout(() => {
          setStep('login'); setMessage({ text: '', type: '' })
          setForgotEmail(''); setResetToken(''); setNewPassword(''); setConfirmPassword('')
        }, 2000)
      } else {
        showMsg('Invalid token or request failed.')
      }
    } catch {
      showMsg('Server error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-[#0E7C86]/15 focus:border-[#0E7C86]/60 transition-all duration-200"
  const labelClass = "mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300"
  const linkClass = "cursor-pointer font-semibold text-[#0E7C86] dark:text-[#7FD0D6] hover:underline underline-offset-2"

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 transition-colors duration-300">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white/75 dark:bg-[#121B2E]/65 backdrop-blur-2xl p-8 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)] border border-black/5 dark:border-white/10">

        {/* ───── LOGIN ───── */}
        {step === 'login' && (
          <>
            <div className="mb-7 text-center">
              <span className="inline-block w-10 h-1 rounded-full bg-[#C9A24B] mb-4" />
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                Sign in to your account
              </h2>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-[#C4514B]/10 border border-[#C4514B]/20 px-4 py-2.5 text-sm text-[#C4514B] dark:text-[#F0928D]">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              {loginType === 'username' ? (
                <div>
                  <label className={labelClass}>Username</label>
                  <input type="text" placeholder="Enter username" value={username}
                    onChange={e => setUsername(e.target.value)} required className={inputClass} />
                </div>
              ) : (
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" placeholder="Enter email" value={email}
                    onChange={e => setEmail(e.target.value)} required className={inputClass} />
                </div>
              )}

              <div>
                <label className={labelClass}>Password</label>
                <input type="password" placeholder="Enter password" value={password}
                  onChange={e => setPassword(e.target.value)} required className={inputClass} />
              </div>

              <button type="submit" disabled={loading}
                className="w-full rounded-xl bg-[#0E7C86] hover:bg-[#0B6971] py-3 text-sm font-semibold text-white shadow-lg shadow-[#0E7C86]/25 disabled:opacity-60 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              {loginType === 'username' ? 'Login with Email?' : 'Login with Username?'}{' '}
              <span onClick={() => setLoginType(loginType === 'username' ? 'email' : 'username')} className={linkClass}>
                Click here
              </span>
            </p>

            <p className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
              Forgot password?{' '}
              <span onClick={() => { setStep('forgot'); setMessage({ text: '', type: '' }) }} className={linkClass}>
                Click here
              </span>
            </p>

            <p className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <span onClick={() => navigate('/register')} className={linkClass}>
                Register
              </span>
            </p>
          </>
        )}

        {/* ───── FORGOT PASSWORD ───── */}
        {step === 'forgot' && (
          <>
            <div className="mb-2 text-center">
              <span className="inline-block w-10 h-1 rounded-full bg-[#C9A24B] mb-4" />
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Forgot Password</h2>
            </div>
            <p className="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Enter your email and we'll send you a reset token.
            </p>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" placeholder="Enter your email" value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)} className={inputClass} />
              </div>

              {message.text && (
                <p className={`text-sm font-medium ${message.type === 'success' ? 'text-[#3F9868] dark:text-[#6FCB99]' : 'text-[#C4514B] dark:text-[#F0928D]'}`}>
                  {message.text}
                </p>
              )}

              <button onClick={handleForgotPassword} disabled={loading}
                className="w-full rounded-xl bg-[#0E7C86] hover:bg-[#0B6971] py-3 text-sm font-semibold text-white shadow-lg shadow-[#0E7C86]/25 disabled:opacity-60 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                {loading ? 'Sending...' : 'Send Reset Token'}
              </button>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                <span onClick={() => setStep('login')} className={linkClass}>
                  ← Back to Login
                </span>
              </p>
            </div>
          </>
        )}

        {/* ───── RESET PASSWORD ───── */}
        {step === 'reset' && (
          <>
            <div className="mb-2 text-center">
              <span className="inline-block w-10 h-1 rounded-full bg-[#C9A24B] mb-4" />
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Reset Password</h2>
            </div>
            <p className="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Enter the token from your email and set a new password.
            </p>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Reset Token</label>
                <input type="text" placeholder="Enter reset token" value={resetToken}
                  onChange={e => setResetToken(e.target.value)} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className={`${inputClass} ${newPassword && (allPasswordRulesPassed ? 'border-[#3F9868]/60 focus:ring-[#3F9868]/15' : 'border-[#C4514B]/50 focus:ring-[#C4514B]/15')}`}
                />
                {/* ✅ Real-time password strength checker */}
                <PasswordStrengthChecker password={newPassword} />
              </div>

              <div>
                <label className={labelClass}>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className={`${inputClass} ${confirmPassword && (confirmPassword === newPassword ? 'border-[#3F9868]/60 focus:ring-[#3F9868]/15' : 'border-[#C4514B]/50 focus:ring-[#C4514B]/15')}`}
                />
                {confirmPassword && (
                  <p className={`mt-1 text-xs font-medium ${confirmPassword === newPassword ? 'text-[#3F9868] dark:text-[#6FCB99]' : 'text-[#C4514B] dark:text-[#F0928D]'}`}>
                    {confirmPassword === newPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
                  </p>
                )}
              </div>

              {message.text && (
                <p className={`text-sm font-medium ${message.type === 'success' ? 'text-[#3F9868] dark:text-[#6FCB99]' : 'text-[#C4514B] dark:text-[#F0928D]'}`}>
                  {message.text}
                </p>
              )}

              <button
                onClick={handleResetPassword}
                disabled={loading || !allPasswordRulesPassed || newPassword !== confirmPassword}
                className="w-full rounded-xl bg-[#0E7C86] hover:bg-[#0B6971] py-3 text-sm font-semibold text-white shadow-lg shadow-[#0E7C86]/25 disabled:opacity-60 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                <span onClick={() => setStep('forgot')} className={linkClass}>
                  ← Back
                </span>
              </p>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
