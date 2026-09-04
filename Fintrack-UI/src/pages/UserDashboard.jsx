import { useEffect, useState } from 'react'
import api from '../services/api'
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts'
import AnimatedBackground from '../components/AnimatedBackground'

export default function UserDashboard() {
  const [month, setMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })

  const [summary, setSummary] = useState({
    totalIncome: 0, totalExpense: 0, netBalance: 0, budgetLimit: null, budgetRemaining: null
  })
  const [analyticsData, setAnalyticsData] = useState([])
  const [budgetLimit, setBudgetLimit] = useState(0)
  const [spent, setSpent] = useState(0)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)

  useEffect(() => {
  if (!month) return

  const fetchSummary = async () => {
    try {
      const res = await api.get(`/analytics/summary?month=${month}`)
      setSummary(res.data)
      setSpent(res.data?.totalExpense ?? 0)
    } catch (error) {
      console.error("Failed to fetch summary:", error)
    } finally {
      setLoadingSummary(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const res = await api.get(`/analytics/category-split`, {
        params: { month }
      })

      setAnalyticsData(
        Array.isArray(res.data) ? res.data : []
      )
    } catch (error) {
      console.error("Failed to fetch category analytics:", error)
    } finally {
      setLoadingAnalytics(false)
    }
  }

  const fetchBudget = async () => {
    try {
      const res = await api.get(`/analytics/monthlyLimit/${month}`)
      setBudgetLimit(res.data?.monthlyLimit ?? 0)
    } catch (error) {
      console.error("Failed to fetch budget:", error)
    }
  }

  fetchSummary()
  fetchAnalytics()
  fetchBudget()
}, [month])

  const budgetPercent = budgetLimit ? Math.min((spent / budgetLimit) * 100, 100) : 0
  const formatCurrency = value => (value === null ? 'Not Set' : `₹ ${value.toLocaleString()}`)

  const COLORS = ['#0E7C86', '#C9A24B', '#C4514B', '#3F9868', '#6C7A96', '#8B6F4E', '#4C86A8']

  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <AnimatedBackground />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header + Month Selector */}
        <div className="bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-3xl p-8 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.15)] mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <span className="inline-block w-8 h-1 rounded-full bg-[#C9A24B] mb-3" />
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                Dashboard
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">Your financial overview at a glance</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="font-ledger text-sm text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-white/5 px-4 py-2.5 rounded-xl">
                {month}
              </div>
              <select
                value={month}
                onChange={e => setMonth(e.target.value)}
                className="px-5 py-2.5 bg-white/70 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 rounded-xl font-ledger text-sm font-semibold text-slate-900 dark:text-white shadow-sm hover:shadow-md transition-all duration-200 focus:ring-4 focus:ring-[#0E7C86]/15 focus:outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const date = new Date()
                  date.setMonth(date.getMonth() - i)
                  const year = date.getFullYear()
                  const mon = String(date.getMonth() + 1).padStart(2, '0')
                  return <option key={`${year}-${mon}`} value={`${year}-${mon}`}>{`${year}-${mon}`}</option>
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
          <DashboardCard title="Total Income" value={loadingSummary ? 'Loading...' : formatCurrency(summary.totalIncome)} accent="#3F9868" loading={loadingSummary} />
          <DashboardCard title="Total Expense" value={loadingSummary ? 'Loading...' : formatCurrency(summary.totalExpense)} accent="#C4514B" loading={loadingSummary} />
          <DashboardCard title="Net Balance" value={loadingSummary ? 'Loading...' : formatCurrency(summary.netBalance)} accent="#0E7C86" loading={loadingSummary} />
          <DashboardCard title="Budget Limit" value={loadingSummary ? 'Loading...' : formatCurrency(summary.budgetLimit)} accent="#C9A24B" loading={loadingSummary} />
          <DashboardCard
            title="Remaining Budget"
            value={loadingSummary ? 'Loading...' : formatCurrency(summary.budgetRemaining)}
            accent={summary.budgetRemaining !== null && summary.budgetRemaining < 0 ? "#C4514B" : "#3F9868"}
            loading={loadingSummary}
          />
        </div>

        {/* Analytics Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-3xl p-8 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.15)]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Spending by Category
              </h3>
              {loadingAnalytics && (
                <div className="w-8 h-8 bg-[#0E7C86]/15 rounded-xl animate-pulse" />
              )}
            </div>

            {loadingAnalytics ? (
              <div className="flex items-center justify-center h-80 bg-slate-50/60 dark:bg-white/[0.03] rounded-2xl">
                <div className="text-slate-500 dark:text-slate-400 text-sm">Loading analytics...</div>
              </div>
            ) : analyticsData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-80 bg-slate-50/60 dark:bg-white/[0.03] rounded-2xl text-center">
                <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-slate-500 dark:text-slate-400 font-medium">No spending data available</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Track your transactions to see insights</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={340}>
                <PieChart>
                  <Pie data={analyticsData} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={108} innerRadius={62} paddingAngle={3}>
                    {analyticsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--tooltip-bg, #fff)', border: 'none', borderRadius: '12px', color: 'inherit' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Budget Progress */}
          <div className="bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-3xl p-8 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.15)]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-11 h-11 bg-[#C9A24B]/15 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#C9A24B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">Monthly Budget</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Track your spending progress</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <div className="w-full bg-slate-200/70 dark:bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      budgetPercent > 80 ? 'bg-[#C4514B]'
                      : budgetPercent > 50 ? 'bg-[#C9A24B]'
                      : 'bg-[#0E7C86]'
                    }`}
                    style={{ width: `${budgetPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm mt-2 font-ledger">
                  <span className="text-slate-600 dark:text-slate-400">₹{spent.toLocaleString()}</span>
                  <span className="text-slate-600 dark:text-slate-400">₹{budgetLimit.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-black/5 dark:border-white/10">
                <div className="text-center p-4 bg-[#3F9868]/10 rounded-2xl">
                  <div className="font-ledger text-2xl font-bold text-[#3F9868] dark:text-[#6FCB99]">₹{(budgetLimit - spent).toLocaleString()}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Remaining</div>
                </div>
                <div className="text-center p-4 bg-slate-100/70 dark:bg-white/5 rounded-2xl">
                  <div className="font-ledger text-2xl font-bold text-slate-900 dark:text-white">{budgetPercent.toFixed(0)}%</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">Utilized</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardCard({ title, value, accent, loading }) {
  if (loading) {
    return (
      <div className="bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl p-5 shadow-sm animate-pulse">
        <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-20 mb-4"></div>
        <div className="h-6 bg-slate-200 dark:bg-white/10 rounded w-28"></div>
      </div>
    )
  }

  return (
    <div className="group bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl p-5 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.12)] hover:shadow-[0_10px_30px_-8px_rgba(15,23,42,0.18)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden">
      <span className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: accent }} />
      <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 tracking-wide uppercase">{title}</h3>
      <p className="font-ledger text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  )
}
