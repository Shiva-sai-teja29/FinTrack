import { api, BASE_API_URL } from '../services/api'

export default function ReceiptUpload({ transactionId }) {

  const upload = async e => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)

    await api.post(
      `/transactions/${transactionId}/upload-receipt`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  }
  
  const preview = () => {
  window.open(
    `${BASE_API_URL}/transactions/${transactionId}/receipt`,
    '_blank'
  )
}


  return (
    <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-white/70 dark:bg-[#121B2E]/60 backdrop-blur-xl border border-black/5 dark:border-white/10">
      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#0E7C86] dark:text-[#7FD0D6] bg-[#0E7C86]/10 hover:bg-[#0E7C86]/15 border border-[#0E7C86]/20 transition-colors duration-200">
        📎 Choose Receipt
        <input type="file" onChange={upload} className="hidden" />
      </label>
      <button
        onClick={preview}
        className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#C9A24B] hover:bg-[#B78D3C] text-[#0B1120] shadow-md shadow-[#C9A24B]/25 hover:-translate-y-0.5 transition-all duration-200"
      >
        👁️ Preview Receipt
      </button>
    </div>
  )
}
