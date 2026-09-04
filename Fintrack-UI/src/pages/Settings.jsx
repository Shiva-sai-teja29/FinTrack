import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Toast } from '../components/Toast'
import AnimatedBackground from '../components/AnimatedBackground'

export default function Settings() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    oldPassword: '', newUsername: '', newEmail: '', newPassword: ''
  })

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleUpdate = async () => {
    try {
      await api.put('/user', form)
      showToast('Profile updated. Please login again.', 'success')
      setTimeout(() => { localStorage.removeItem('token'); navigate('/login') }, 1500)
    } catch (err) {
      showToast(err.response?.data || 'Update failed', 'error')
    }
  }

  const [preferences, setPreferences] = useState({
    currency: '', timezone: '', language: '', emailNotifications: false, pushNotifications: false
  })

  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'info' })

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type }), 3000)
  }

  useEffect(() => {
    api.get('/users/preferences')
      .then(res => setPreferences(res.data))
      .catch(() => showToast('Failed to load preferences', 'error'))
  }, [])

  const savePreferences = async () => {
    if (loading) return
    try {
      setLoading(true)
      await api.put('/users/preferences', preferences)
      showToast('Preferences saved successfully', 'success')
    } catch {
      showToast('Failed to save preferences', 'error')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-[#0E7C86]/15 focus:border-[#0E7C86]/60 transition-all duration-200"
  const selectClass = "w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#0E7C86]/15 focus:border-[#0E7C86]/60 transition-all duration-200 appearance-none"
  const labelClass = "block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2"
  const panelClass = "bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-3xl p-8 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.15)] hover:shadow-[0_12px_50px_-12px_rgba(15,23,42,0.2)] transition-shadow duration-300"

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <AnimatedBackground />

      <div className="relative z-10 max-w-4xl mx-auto">
        <Toast message={toast.message} type={toast.type} />

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block w-10 h-1 rounded-full bg-[#C9A24B] mb-4" />
          <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Manage your account, profile, and preferences easily.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* UPDATE PROFILE */}
          <div className={panelClass}>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-[#0E7C86]/15 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-[#0E7C86]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Profile</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Current Password *</label>
                <input type="password" name="oldPassword" placeholder="Enter current password" className={inputClass} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>New Username</label>
                <input type="text" name="newUsername" placeholder="Enter new username" className={inputClass} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>New Email</label>
                <input type="email" name="newEmail" placeholder="Enter new email" className={inputClass} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>New Password</label>
                <input type="password" name="newPassword" placeholder="Enter new password" className={inputClass} onChange={handleChange} />
              </div>

              <button
                onClick={handleUpdate}
                className="w-full bg-[#0E7C86] hover:bg-[#0B6971] text-white py-3.5 px-6 rounded-xl font-semibold hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-lg shadow-[#0E7C86]/25"
              >
                Update Profile & Logout
              </button>
            </div>
          </div>

          {/* PREFERENCES */}
          <div className={panelClass}>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-[#C9A24B]/15 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-[#C9A24B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Preferences</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className={labelClass}>Currency</label>
                <select className={selectClass} value={preferences.currency} onChange={e => setPreferences({ ...preferences, currency: e.target.value })}>
                  <option value="">Select Currency</option>
                  <option value="INR">₹ INR (Indian Rupee)</option>
                  <option value="USD">$ USD (US Dollar)</option>
                  <option value="EUR">€ EUR (Euro)</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Timezone</label>
                <select className={selectClass} value={preferences.timezone} onChange={e => setPreferences({ ...preferences, timezone: e.target.value })}>
                  <option value="">Select Timezone</option>
                  <option value="ASIA_KOLKATA">Asia / Kolkata (IST)</option>
                  <option value="EUROPE_LONDON">Europe / London (GMT)</option>
                  <option value="AMERICA_NEW_YORK">America / New York (EST)</option>
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Language</label>
                <select className={selectClass} value={preferences.language} onChange={e => setPreferences({ ...preferences, language: e.target.value })}>
                  <option value="">Select Language</option>
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                </select>
              </div>

              {/* Notifications */}
              <div>
                <label className={labelClass.replace('mb-2', 'mb-3')}>Notifications</label>
                <div className="space-y-1 p-3 bg-slate-50/60 dark:bg-white/[0.03] rounded-xl">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications' },
                    { key: 'pushNotifications', label: 'Push Notifications' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 p-3 hover:bg-white/60 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors duration-200">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors duration-200 ${
                        preferences[key] ? 'bg-[#0E7C86] border-[#0E7C86]' : 'border-slate-300 dark:border-slate-500 bg-white dark:bg-transparent'
                      }`}>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={preferences[key]}
                          onChange={e => setPreferences({ ...preferences, [key]: e.target.checked })}
                        />
                        {preferences[key] && (
                          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-slate-800 dark:text-white">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={savePreferences}
                disabled={loading}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  loading
                    ? 'bg-slate-300 dark:bg-white/10 cursor-not-allowed text-slate-500 dark:text-slate-400'
                    : 'bg-[#C9A24B] hover:bg-[#B78D3C] hover:-translate-y-0.5 active:translate-y-0 text-[#0B1120] shadow-lg shadow-[#C9A24B]/25'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </span>
                ) : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
