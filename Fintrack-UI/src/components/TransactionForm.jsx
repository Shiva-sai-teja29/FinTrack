// import { useState } from 'react'
// import api from '../services/api'

// export default function TransactionForm({ existing, onSuccess }) {
//   const [amount, setAmount] = useState(existing?.amount || '')
//   const [category, setCategory] = useState(existing?.category || '')
//   const [type, setType] = useState(existing?.type || 'EXPENSE')

//   const submit = async e => {
//     e.preventDefault()

//     const payload = { amount, category, type }

//     if (existing?.id) {
//       await api.put('/transactions', { ...payload, id: existing.id })
//     } else {
//       await api.post('/transactions', payload)
//     }

//     onSuccess()
//   }

//   return (
//     <form onSubmit={submit}>
//       <h3>{existing ? 'Edit' : 'Add'} Transaction</h3>

//       <input
//         placeholder="Amount"
//         type="number"
//         value={amount}
//         onChange={e => setAmount(e.target.value)}
//         required
//       />

//       <input
//         placeholder="Category"
//         value={category}
//         onChange={e => setCategory(e.target.value)}
//         required
//       />

//       <select value={type} onChange={e => setType(e.target.value)}>
//         <option value="EXPENSE">Expense</option>
//         <option value="INCOME">Income</option>
//       </select>

//       <button type="submit">Save</button>
//     </form>
//   )
// }
