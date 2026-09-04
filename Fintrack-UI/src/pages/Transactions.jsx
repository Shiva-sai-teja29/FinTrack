import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import AnimatedBackground from '../components/AnimatedBackground'

export default function Transactions() {
  const navigate = useNavigate()

  const [transactions, setTransactions] = useState([])
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [sortBy, setSortBy] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [startMonth, setStartMonth] = useState('')
  const [endMonth, setEndMonth] = useState('')
  const [columns, setColumns] = useState({
    category: true, amount: true, date: true, type: true, receipt: true, actions: true, payment:true
  })
  const [toast, setToast] = useState({ message: '', type: 'success' })
  const [previewUrl, setPreviewUrl] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const loadTransactions = async () => {
    const res = await api.get('/transactions', {
      params: { pageNo, pageSize, sortBy, sortDir, search }
    })
    setTransactions(res.data.transactions)
    setTotalPages(res.data.totalPages)
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type }), 3000)
  }

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortBy(col); setSortDir('asc') }
  }

  const uploadReceipt = async (id, file) => {
    if (!file) return
    const fd = new FormData(); fd.append('file', file)
    await api.post(`/transactions/${id}/upload-receipt`, fd)
    showToast('Receipt uploaded'); loadTransactions()
  }

  const replaceReceipt = async (id, file) => {
    if (!file) return
    const fd = new FormData(); fd.append('file', file)
    await api.post(`/transactions/${id}/replace-receipt`, fd)
    showToast('Receipt replaced'); loadTransactions()
  }

  const previewReceipt = async (id) => {
    const res = await api.get(`/transactions/${id}/receipt/preview`, { responseType: 'blob' })
    setPreviewUrl(URL.createObjectURL(res.data))
  }

  const downloadReceipt = async (id) => {
    const res = await api.get(`/transactions/${id}/receipt`, { responseType: 'blob' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(res.data); a.download = 'receipt'; a.click()
  }

  const deleteReceipt = async (id) => {
    await api.delete(`/transactions/${id}/receipt`)
    showToast('Receipt deleted', 'info'); loadTransactions()
  }

  const editTransaction = (txn) => navigate('/edit', { state: { editingTransaction: txn } })

  const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`)
    showToast('Transaction deleted', 'info'); loadTransactions()
  }

 const exportByMonthRange = async (format) => {
  if (startMonth > endMonth) {
    showToast('Start month cannot be after end month', 'error')
    return
  }

  const res = await api.get(`/transactions/export/${format}`, {
    params: { startMonth, endMonth },
    responseType: 'blob'
  })

  const url = window.URL.createObjectURL(new Blob([res.data]))
  const a = document.createElement('a')
  a.href = url
  a.download = `transactions-${startMonth}-${endMonth}.${format === 'excel' ? 'xlsx' : 'csv'}`
  document.body.appendChild(a)
  a.click()
  a.remove()

  window.URL.revokeObjectURL(url)

  // Reset UI fields
  setStartMonth('')
  setEndMonth('')
}

  

  useEffect(() => {
    const t = setTimeout(() => { setPageNo(1); setSearch(searchInput) }, 500)
    return () => clearTimeout(t)
  }, [searchInput])

  useEffect(() => { loadTransactions() }, [pageNo, pageSize, sortBy, sortDir, search, typeFilter])

  const thClass = "p-4 cursor-pointer text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 hover:text-[#0E7C86] dark:hover:text-[#7FD0D6] transition-colors select-none"
  const tdClass = "p-4 text-slate-700 dark:text-slate-200"
  const dateInputClass = "border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-900 dark:text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0E7C86]/15 transition-all duration-200 font-ledger text-sm"

  return (
    <div className="relative min-h-screen p-6 transition-colors duration-300">
      <AnimatedBackground />

      {/* TOAST */}
      {toast.message && (
        <div className="fixed top-6 right-6 bg-white/85 dark:bg-[#121B2E]/85 backdrop-blur-xl text-slate-800 dark:text-white px-5 py-3 rounded-2xl z-50 shadow-[0_12px_40px_-8px_rgba(15,23,42,0.25)] border border-black/5 dark:border-white/10 text-sm font-medium">
          {toast.message}
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewUrl && (
        <div className="fixed inset-0 bg-[#0B1120]/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#121B2E] p-4 rounded-2xl max-w-3xl w-full border border-black/5 dark:border-white/10 shadow-2xl">
            <iframe src={previewUrl} className="w-full h-[70vh] rounded-xl" />
            <button onClick={() => setPreviewUrl(null)} className="mt-3 px-4 py-2 bg-[#0E7C86] hover:bg-[#0B6971] text-white rounded-xl text-sm font-semibold transition-colors">
              Close
            </button>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirm && (
        <div className="fixed inset-0 bg-[#0B1120]/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#121B2E] p-6 rounded-2xl border border-black/5 dark:border-white/10 shadow-2xl max-w-sm w-full mx-4">
            <p className="mb-5 text-slate-800 dark:text-white">{confirm.message}</p>
            <div className="flex gap-3">
              <button onClick={confirm.onYes} className="flex-1 bg-[#C4514B] hover:bg-[#AE443E] text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors">Yes</button>
              <button onClick={() => setConfirm(null)} className="flex-1 px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl font-semibold text-sm transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <span className="inline-block w-8 h-1 rounded-full bg-[#C9A24B] mb-2" />
            <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Transactions</h1>
          </div>
          <button onClick={() => navigate('/edit')} className="bg-[#0E7C86] hover:bg-[#0B6971] text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-[#0E7C86]/25 hover:-translate-y-0.5 transition-all duration-200">
            + Add Transaction
          </button>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap gap-4 mb-4 items-center bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl p-4">
          <label className="flex gap-2 items-center text-sm font-medium text-slate-600 dark:text-slate-300">Start Month:</label>
          <input
            type="month"
            value={startMonth}
            onChange={e => setStartMonth(e.target.value)}
            className={dateInputClass}
          />
          <label className="flex gap-2 items-center text-sm font-medium text-slate-600 dark:text-slate-300">End Month:</label>
          <input
            type="month"
            value={endMonth}
            onChange={e => setEndMonth(e.target.value)}
            min={startMonth}
            className={dateInputClass}
          />

          <button disabled={!startMonth || !endMonth} onClick={() => exportByMonthRange('csv')} className="bg-[#3F9868] hover:bg-[#357F56] disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            Export CSV
          </button>
          <button disabled={!startMonth || !endMonth} onClick={() => exportByMonthRange('excel')} className="bg-[#0E7C86] hover:bg-[#0B6971] disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            Export Excel
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search..."
            className="border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-4 py-2.5 rounded-xl w-64 focus:outline-none focus:ring-4 focus:ring-[#0E7C86]/15 transition-all duration-200 text-sm"
          />
        </div>

        {/* COLUMN TOGGLE */}
        <div className="flex gap-4 mb-4 flex-wrap">
          {Object.keys(columns).map(col => (
            <label key={col} className="flex gap-2 items-center text-sm text-slate-600 dark:text-slate-300 cursor-pointer capitalize">
              <input
                type="checkbox"
                checked={columns[col]}
                onChange={() => setColumns(prev => ({ ...prev, [col]: !prev[col] }))}
                className="accent-[#0E7C86] w-4 h-4"
              />
              {col}
            </label>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-2xl rounded-2xl shadow-[0_8px_40px_-12px_rgba(15,23,42,0.15)] overflow-x-auto border border-black/5 dark:border-white/10">
          <table className="w-full">
            <thead className="bg-slate-50/70 dark:bg-white/[0.03]">
              <tr>
                {columns.category && <th onClick={() => handleSort('category')} className={thClass}>Category</th>}
                {columns.amount && <th onClick={() => handleSort('amount')} className={thClass}>Amount</th>}
                {columns.date && <th onClick={() => handleSort('date')} className={thClass}>Date</th>}
                {columns.type && <th onClick={() => handleSort('type')} className={thClass}>Type</th>}
                {columns.receipt && <th className={thClass}>Receipt</th>}
                {columns.payment && <th className={thClass}>Payment</th>}
                {columns.actions && <th className={thClass}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id} className="border-t border-black/5 dark:border-white/5 hover:bg-slate-50/60 dark:hover:bg-white/[0.03] transition-colors">
                  {columns.category && <td className={tdClass}>{t.category}</td>}
                  {columns.amount && <td className={`${tdClass} font-ledger font-semibold`}>₹{t.amount}</td>}
                  {columns.date && <td className={`${tdClass} font-ledger text-sm`}>{new Date(t.date).toLocaleDateString()}</td>}
                  {columns.type && (
                    <td className={tdClass}>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        t.type === 'INCOME'
                          ? 'bg-[#3F9868]/15 text-[#3F9868] dark:text-[#6FCB99]'
                          : 'bg-[#C4514B]/15 text-[#C4514B] dark:text-[#F0928D]'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                  )}

                  {columns.receipt && (
                    <td className={tdClass}>
                      {!t.hasReceipt ? (
                        <label className="text-[#0E7C86] dark:text-[#7FD0D6] cursor-pointer hover:underline text-sm font-medium">
                          Upload
                          <input hidden type="file" onChange={e => uploadReceipt(t.id, e.target.files[0])} />
                        </label>
                      ) : (
                        <div className="flex gap-2 text-sm">
                          <button onClick={() => previewReceipt(t.id)} title="Preview" className="hover:opacity-70 transition-opacity">👁️</button>
                          <button onClick={() => downloadReceipt(t.id)} title="Download" className="hover:opacity-70 transition-opacity">⬇️</button>
                          <label className="cursor-pointer hover:opacity-70 transition-opacity" title="Replace">
                            🔁
                            <input hidden type="file" onChange={e => replaceReceipt(t.id, e.target.files[0])} />
                          </label>
                          <button onClick={() => setConfirm({ message: 'Delete receipt?', onYes: () => { deleteReceipt(t.id); setConfirm(null) } })} title="Delete" className="hover:opacity-70 transition-opacity">🗑️</button>
                        </div>
                      )}
                    </td>
                  )}
                  {columns.payment && <td className={`${tdClass} text-sm`}>{t.paymentType}</td>}
                  {columns.actions && (
                    <td className={tdClass}>
                      <div className="flex gap-3 text-sm">
                        <button onClick={() => editTransaction(t)} title="Edit" className="hover:opacity-70 transition-opacity">✏️</button>
                        <button onClick={() => setConfirm({ message: 'Delete transaction?', onYes: () => { deleteTransaction(t.id); setConfirm(null) } })} title="Delete" className="hover:opacity-70 transition-opacity">🗑️</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center gap-4 mt-6 items-center">
          <button
            disabled={pageNo === 1}
            onClick={() => setPageNo(p => p - 1)}
            className="px-4 py-2 rounded-xl bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-md border border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-white dark:hover:bg-white/10 transition-colors text-sm font-medium"
          >
            Prev
          </button>
          <strong className="text-slate-700 dark:text-slate-300 font-ledger text-sm font-medium">Page {pageNo} of {totalPages}</strong>
          <button
            disabled={pageNo === totalPages}
            onClick={() => setPageNo(p => p + 1)}
            className="px-4 py-2 rounded-xl bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-md border border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-white dark:hover:bg-white/10 transition-colors text-sm font-medium"
          >
            Next
          </button>

          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            className="border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-md text-slate-900 dark:text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#0E7C86]/15 transition-all duration-200 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
    </div>
  )
}
