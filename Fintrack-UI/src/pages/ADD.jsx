import { useEffect, useState } from 'react'
import api from '../services/api'
import { useLocation, useNavigate } from 'react-router-dom'
import AnimatedBackground from '../components/AnimatedBackground'

export default function BudgetPage() {
  const navigate = useNavigate()
  const location = useLocation()

  /* -------------------- STATE -------------------- */
  const [month, setMonth] = useState('')
  const [monthlyLimit, setMonthlyLimit] = useState('')
  const [allLimits, setAllLimits] = useState([])

  const [form, setForm] = useState({
    id: null,
    category: '',
    amount: '',
    date: '',
    type: 'EXPENSE',
    description: '',
    paymentType:'OTHERS'
  })
  const paymentTypes = ["CASH_PHYSICAL_CURRENCY",
    "DEBIT_CARD",
    "CREDIT_CARD",
    "PREPAID_CARDS",
    "UPI_GOOGLEPAY",
    "UPI_PHONEPE",
    "UPI_BHIM",
    "UPI_PAYTM",
    "UPI_AMAZON_PAY",
    "DIGITAL_WALLET_PAYTM",
    "DIGITAL_WALLET_MOBIKWIK",
    "DIGITAL_WALLET_AMAZON_PAY",
    "DIGITAL_WALLET_PHONEPE",
    "BANK_TRANSFERS_NEFT",
    "BANK_TRANSFERS_RTGS",
    "BANK_TRANSFERS_IMPS",
    "NET_BANKING",
    "BNPL_LAZYPAY",
    "BNPL_ZESTMONEY",
    "AUTOPAY_RECURRING_PAYMENTS",
    "CHEQUES",
    "DEMAND_DRAFTS",
    "OTHERS"];

  const [toast, setToast] = useState({ message: '', type: 'success' })

  /* -------------------- TOAST -------------------- */
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type }), 3000)
  }

  /* -------------------- LOADERS -------------------- */
  useEffect(() => {
    loadAllLimits()
  }, [])

  useEffect(() => {
    const editingTransaction = location.state?.editingTransaction
    if (editingTransaction) {
      setForm(editingTransaction)
      showToast('Editing transaction', 'info')
    }
  }, [location.state])

  const loadAllLimits = async () => {
    try {
      const res = await api.get('/analytics/monthlyLimit')
      setAllLimits(res.data)
    } catch {}
  }

  const loadMonthlyLimit = async (m) => {
    try {
      const res = await api.get(`/analytics/monthlyLimit/${m}`)
      setMonthlyLimit(res.data.monthlyLimit)
    } catch {
      setMonthlyLimit('')
    }
  }

  /* -------------------- TRANSACTION -------------------- */
  const submitTransaction = async (e) => {
    e.preventDefault()
    const payload = { ...form, amount: Number(form.amount) }

    try {
      form.id
        ? await api.put('/transactions', payload)
        : await api.post('/transactions', payload)

      showToast(form.id ? 'Transaction updated' : 'Transaction added')
      resetForm()
    } catch {}
  }

  const resetForm = () => {
    setForm({ id: null, category: '', amount: '', date: '', type: 'EXPENSE', description: '', paymentType: 'OTHERS'})
  }

  /* -------------------- BUDGET -------------------- */
  const setLimit = async () => {
    await api.post('/analytics/monthlyLimit', { month, monthlyLimit })
    showToast('Budget set')
    clearBudget()
    loadAllLimits()
  }

  const updateLimit = async () => {
    await api.put('/analytics/monthlyLimit', { month, monthlyLimit })
    showToast('Budget updated')
    clearBudget()
    loadAllLimits()
  }

  const clearBudget = () => {
    setMonth('')
    setMonthlyLimit('')
  }

  const budgetExists = allLimits.some(l => l.month === month)

  const inputClass = "w-full px-4 py-3.5 text-sm rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-[#0E7C86]/15 focus:border-[#0E7C86]/60 transition-all duration-200"
  const cardClass = "bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.15)] border border-black/5 dark:border-white/10"

  /* ====================== UI ====================== */
  return (
    <div className="relative min-h-screen px-4 py-10 transition-colors duration-300">
      <AnimatedBackground />

      {/* Toast */}
      {toast.message && (
        <div className="fixed top-6 right-6 z-50 bg-white/85 dark:bg-[#121B2E]/85 backdrop-blur-xl text-slate-800 dark:text-white px-6 py-3 rounded-2xl shadow-[0_12px_40px_-8px_rgba(15,23,42,0.25)] border border-black/5 dark:border-white/10 text-sm font-medium">
          {toast.message}
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">

        {/* ---------- HEADER ---------- */}
        <div className={`${cardClass} flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6`}>
          <div>
            <span className="inline-block w-8 h-1 rounded-full bg-[#C9A24B] mb-3" />
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Every Transaction matters
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Manage spending and monthly limits in one place
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/transactions')}
              className="px-6 py-3 rounded-xl bg-[#0E7C86] hover:bg-[#0B6971] text-white font-semibold text-sm shadow-lg shadow-[#0E7C86]/25 hover:-translate-y-0.5 transition-all duration-200"
            >
              View Transactions
            </button>
            <button
              onClick={() => navigate('/MonthlyBudgets')}
              className="px-6 py-3 rounded-xl bg-[#C9A24B] hover:bg-[#B78D3C] text-[#0B1120] font-semibold text-sm shadow-lg shadow-[#C9A24B]/25 hover:-translate-y-0.5 transition-all duration-200"
            >
              View Budgets
            </button>
          </div>
        </div>

        {/* ---------- MAIN GRID ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ---------- TRANSACTION CARD ---------- */}
          <div className={cardClass}>
            <h2 className="font-display text-xl font-bold mb-6 text-slate-900 dark:text-white">
              {form.id ? 'Edit Transaction' : 'Add Transaction'}
            </h2>

            <form onSubmit={submitTransaction} className="space-y-4">
              <input
                placeholder="Category (e.g. Groceries, Rent, Salary)"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className={inputClass}
                required
              />

              <input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                className={`${inputClass} font-ledger`}
                required
              />

              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className={`${inputClass} font-ledger`}
                required
              />

              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                className={inputClass}
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
              
              <select
              value={form.paymentType}
                onChange={e => setForm({ ...form, paymentType: e.target.value })}
                className={inputClass}
              >
                {paymentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>  
              
              <textarea
                placeholder="Description (optional – add notes, payment method, reference, etc.)"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={4}
                className={`${inputClass} resize-none`}
              />

              <div className="flex gap-3">
                <button className="flex-1 bg-[#0E7C86] hover:bg-[#0B6971] text-white py-3 rounded-xl font-semibold text-sm shadow-lg shadow-[#0E7C86]/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                  {form.id ? 'Update' : 'Add'}
                </button>
                {form.id && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white font-semibold text-sm hover:bg-slate-200 dark:hover:bg-white/20 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* ---------- BUDGET CARD ---------- */}
          <div className={cardClass}>
            <h2 className="font-display text-xl font-bold mb-6 text-slate-900 dark:text-white">
              Set Monthly Budget
            </h2>

            <div className="space-y-4">
              <input
                type="month"
                value={month}
                onChange={e => {
                  setMonth(e.target.value)
                  loadMonthlyLimit(e.target.value)
                }}
                className={`${inputClass} font-ledger`}
              />

              <input
                type="number"
                placeholder="Monthly limit"
                value={monthlyLimit}
                onChange={e => setMonthlyLimit(e.target.value)}
                className={`${inputClass} font-ledger`}
                disabled={!month}
              />

              {month && (
                <button
                  onClick={budgetExists ? updateLimit : setLimit}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm bg-[#C9A24B] hover:bg-[#B78D3C] text-[#0B1120] shadow-lg shadow-[#C9A24B]/25 hover:-translate-y-0.5 transition-all duration-200"
                >
                  {budgetExists ? 'Update Budget' : 'Set Budget'}
                </button>
              )}
            </div>

            {/* Existing budgets */}
            <div className="mt-8">
              <h3 className="font-semibold text-sm text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wide">
                Existing Budgets
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {allLimits.map(b => (
                  <div
                    key={b.month}
                    onClick={() => {
                      setMonth(b.month)
                      setMonthlyLimit(b.monthlyLimit)
                    }}
                    className="cursor-pointer p-4 rounded-xl bg-slate-50/70 dark:bg-white/5 hover:bg-[#0E7C86]/10 border border-transparent hover:border-[#0E7C86]/20 transition-all duration-200"
                  >
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {new Date(b.month + '-01').toLocaleString('default', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="font-ledger font-bold text-lg text-slate-900 dark:text-white mt-0.5">
                      ₹{b.monthlyLimit.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
