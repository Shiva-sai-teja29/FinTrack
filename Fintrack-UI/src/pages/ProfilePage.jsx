import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Loader from '../components/Loader'
import AnimatedBackground from '../components/AnimatedBackground'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState('2025-12')
  const [summary, setSummary] = useState(null)
  const [categorySplit, setCategorySplit] = useState([])

  useEffect(() => {
    api.get('/user').then(res => setUser(res.data)).finally(() => setLoading(false))
  }, [])

  useEffect(() => { loadAnalytics() }, [month])

  const loadAnalytics = async () => {
    try {
      const [summaryRes, categoryRes] = await Promise.all([
        api.get('/analytics/summary', { params: { month } }),
        api.get('/analytics/category-split', { params: { month } })
      ])
      setSummary(summaryRes.data)
      setCategorySplit(categoryRes.data)
    } catch (err) {
      console.error('Analytics load failed', err)
    }
  }

  if (loading) return <Loader text="Loading profile..." />
  if (!user) return null

  const { username, email, createdAt, transactionCount = 0 } = user

  return (
    <div className="relative min-h-screen px-6 py-10 transition-colors duration-300">
      <AnimatedBackground />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_40px_-12px_rgba(15,23,42,0.15)] p-8 flex flex-col md:flex-row gap-6 items-center border border-black/5 dark:border-white/10">
          <div className="w-20 h-20 rounded-2xl bg-[#0E7C86] flex items-center justify-center text-white text-2xl font-bold font-display shrink-0">
            {username[0].toUpperCase()}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">{username}</h1>
            <p className="text-slate-600 dark:text-slate-400">{email}</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Joined on {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>

          <Link
            to="/settings"
            className="px-6 py-3 rounded-xl bg-[#0B1120] dark:bg-white text-white dark:text-[#0B1120] font-semibold text-sm hover:bg-[#1c2740] dark:hover:bg-slate-100 transition-colors duration-200"
          >
            Account Settings
          </Link>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-5">
          <StatCard title="Transactions" value={transactionCount} />
          <StatCard title="Account Status" value="Active" />
        </div>

        {/* MONTH SELECTOR */}
        <div className="bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_40px_-12px_rgba(15,23,42,0.15)] p-6 flex items-center justify-between border border-black/5 dark:border-white/10">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Monthly Analytics</h2>
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl px-4 py-2 font-ledger text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#0E7C86]/15 transition-all duration-200"
          />
        </div>

        {/* SUMMARY */}
        {summary && (
          <div className="grid md:grid-cols-5 gap-4">
            <SummaryCard label="Income" value={summary.totalIncome} accent="#3F9868" />
            <SummaryCard label="Expense" value={summary.totalExpense} accent="#C4514B" />
            <SummaryCard label="Net Balance" value={summary.netBalance} accent="#0E7C86" />
            <SummaryCard label="Budget Limit" value={summary.budgetLimit ?? '—'} accent="#C9A24B" />
            <SummaryCard label="Remaining" value={summary.budgetRemaining ?? '—'} accent="#6C7A96" />
          </div>
        )}

        {/* CATEGORY SPLIT */}
        <div className="bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_40px_-12px_rgba(15,23,42,0.15)] p-8 border border-black/5 dark:border-white/10">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-4">
            Category-wise Expense Split
          </h3>

          {categorySplit.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No expenses recorded for this month.</p>
          ) : (
            <div className="space-y-1">
              {categorySplit.map(cat => (
                <div key={cat.category} className="flex justify-between items-center border-b border-black/5 dark:border-white/10 py-3 last:border-0">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{cat.category}</span>
                  <span className="font-ledger font-bold text-slate-900 dark:text-white">₹{cat.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid md:grid-cols-3 gap-5">
          <ActionCard to="/MonthlyBudgets" title="Manage Budgets" />
          <ActionCard to="/transactions" title="View Transactions" />
          <ActionCard to="/settings" title="Edit Profile" />
        </div>

      </div>
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_-8px_rgba(15,23,42,0.12)] p-6 text-center border border-black/5 dark:border-white/10">
      <div className="font-ledger text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{title}</div>
    </div>
  )
}

function SummaryCard({ label, value, accent }) {
  return (
    <div className="bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_-8px_rgba(15,23,42,0.12)] p-5 text-center border border-black/5 dark:border-white/10 relative overflow-hidden">
      <span className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: accent }} />
      <div className="font-ledger text-xl font-bold text-slate-900 dark:text-white">
        {typeof value === 'number' ? `₹${value.toLocaleString()}` : value}
      </div>
      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{label}</div>
    </div>
  )
}

function ActionCard({ to, title }) {
  return (
    <Link
      to={to}
      className="bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_-8px_rgba(15,23,42,0.12)] p-6 text-center hover:shadow-[0_10px_30px_-8px_rgba(15,23,42,0.18)] hover:-translate-y-0.5 transition-all duration-300 border border-black/5 dark:border-white/10 hover:border-[#0E7C86]/30 dark:hover:border-[#0E7C86]/40"
    >
      <h3 className="font-semibold text-slate-800 dark:text-white text-sm">{title}</h3>
    </Link>
  )
}
