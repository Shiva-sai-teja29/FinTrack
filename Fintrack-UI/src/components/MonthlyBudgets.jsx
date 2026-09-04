import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Loader from '../components/Loader'
import AnimatedBackground from '../components/AnimatedBackground'

export default function MonthlyBudgets() {
  const [allBudgets, setAllBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const navigate = useNavigate()

  useEffect(() => {
    loadBudgets()
  }, [selectedYear])

  const loadBudgets = async () => {
    try {
      setLoading(true)
      const res = await api.get('/analytics/monthlyLimit')
      setAllBudgets(res.data)
    } catch (error) {
      console.error('Failed to load budgets:', error)
    } finally {
      setLoading(false)
    }
  }

  const yearBudgets = allBudgets.filter(budget =>
    budget.month.startsWith(selectedYear.toString())
  )

  const budgetMap = Object.fromEntries(
    yearBudgets.map(b => [b.month.slice(5, 7), b.monthlyLimit])
  )

  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  )

  if (loading) return <Loader text="Loading budgets..." />

  return (
    <div className="relative min-h-screen py-12 px-4 transition-colors duration-300">
      <AnimatedBackground />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ---------- HEADER ---------- */}
        <div className="bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-3xl p-8 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.15)] mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>
              <span className="inline-block w-8 h-1 rounded-full bg-[#C9A24B] mb-3" />
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                Monthly Budgets
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                View and compare your budgets year-wise
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
                className="px-5 py-3 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-md text-slate-900 dark:text-white border border-black/10 dark:border-white/10 font-ledger font-semibold shadow-sm hover:shadow-md focus:ring-4 focus:ring-[#0E7C86]/15 outline-none transition-all duration-200"
              >
                {Array.from({ length: 47 }, (_, i) => selectedYear - 23 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              <button
                onClick={() => navigate('/edit')}
                className="px-6 py-3 rounded-xl font-semibold text-white bg-[#0E7C86] hover:bg-[#0B6971] shadow-lg shadow-[#0E7C86]/25 hover:-translate-y-0.5 transition-all duration-300"
              >
                ✏️ Edit Budgets
              </button>
            </div>
          </div>
        </div>

        {/* ---------- MONTHLY CARDS ---------- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {months.map(monthNum => {
            const limit = budgetMap[monthNum]
            const monthName = new Date(selectedYear, monthNum - 1).toLocaleString('default', { month: 'long' })

            return (
              <div
                key={monthNum}
                className={`rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1 backdrop-blur-xl ${
                  limit
                    ? 'bg-[#0E7C86]/10 border-[#0E7C86]/25 shadow-[0_8px_30px_-12px_rgba(14,124,134,0.25)]'
                    : 'bg-white/60 dark:bg-white/5 border-black/5 dark:border-white/10'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-display font-bold text-slate-900 dark:text-white text-sm">{monthName}</h3>
                  <span className={`w-2 h-2 rounded-full ${limit ? 'bg-[#0E7C86]' : 'bg-slate-300 dark:bg-slate-600'}`} />
                </div>

                {limit ? (
                  <div className="text-center">
                    <div className="font-ledger text-xl font-bold text-[#0E7C86] dark:text-[#7FD0D6]">
                      ₹{Number(limit).toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                      Monthly Limit
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 dark:text-slate-500 text-sm font-medium py-6">
                    No Budget Set
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ---------- SUMMARY ---------- */}
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          <div className="bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-xl rounded-2xl p-7 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.12)] text-center border border-black/5 dark:border-white/10">
            <div className="font-ledger text-3xl font-bold text-[#3F9868] dark:text-[#6FCB99]">{yearBudgets.length}</div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Budgets Set</div>
          </div>

          <div className="bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-xl rounded-2xl p-7 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.12)] text-center border border-black/5 dark:border-white/10">
            <div className="font-ledger text-3xl font-bold text-slate-600 dark:text-slate-300">{12 - yearBudgets.length}</div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Months Left</div>
          </div>

          <div className="bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-xl rounded-2xl p-7 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.12)] text-center border border-black/5 dark:border-white/10">
            <div className="font-ledger text-3xl font-bold text-slate-900 dark:text-white">
              ₹{yearBudgets.reduce((s, b) => s + b.monthlyLimit, 0).toLocaleString()}
            </div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Total Budget</div>
          </div>
        </div>

      </div>
    </div>
  )
}
