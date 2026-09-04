import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '../services/auth'
import Loader from '../components/Loader'

export default function PrivateRoute() {

  const auth = isAuthenticated()

  if (auth === null) return <Loader text="Authenticating..." />

  return auth
    ? <Outlet />
    : <Navigate to="/" replace />
}

