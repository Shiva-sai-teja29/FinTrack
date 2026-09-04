import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Login from './pages/Login'
import Register from './pages/Register'
import Transactions from './pages/Transactions'
import UserDashboard from './pages/UserDashboard'
import Profile from './pages/ProfilePage'
import PublicRoute from './routes/PublicRoute'
import PrivateRoute from './routes/PrivateRoute'
import NavBar from './components/NavBar'
// import Loader from './components/Loader'
import { registerToast } from './services/toastService'
import { Toast } from './components/Toast'
import Settings from './pages/Settings'
import BudgetPage from './pages/ADD'
import MonthlyBudgets from './components/MonthlyBudgets'
import GuestDashboard from './pages/GuestDashboard'

export default function App() {
  const [toast, setToast] = useState({
    message: '',
    type: 'info'
  })

  /* ---------- GLOBAL TOAST ---------- */
  useEffect(() => {
    registerToast(({ message, type }) => {
      setToast({ message, type })

      setTimeout(() => {
        setToast({ message: '', type: 'info' })
      }, 3000)
    })
  }, [])

  return (
    <>
      <NavBar />

      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<GuestDashboard />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/UserDashboard" element={<UserDashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/MonthlyBudgets" element={<MonthlyBudgets />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/edit" element={<BudgetPage />} />
        </Route>
      </Routes>

      <Toast message={toast.message} type={toast.type} />
    </>
  )
}
