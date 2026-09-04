import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '../services/auth'
import Loader from '../components/Loader'

export default function PublicRoute() {

  const auth = isAuthenticated()

  if (auth === null) return <Loader />

  return auth
    ? <Navigate to="/UserDashboard" replace />
    : <Outlet />
}
