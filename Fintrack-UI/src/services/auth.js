
import api from './api'

let authInitialized = false
let authenticated = false   // 🔴 single source of truth

/* ================= INIT ================= */
export const initAuth = () => {
  return new Promise(resolve => {
    const token = localStorage.getItem('accessToken')
    authenticated = !!token
    authInitialized = true
    resolve(authenticated)
  })
}

export const isAuthInitialized = () => authInitialized

export const isAuthenticated = () => {
  if (!authInitialized) return null
  return authenticated
}

/* ================= TOKENS ================= */
export const getAccessToken = () =>
  localStorage.getItem('accessToken')

/* ================= AUTH ================= */
export const register = data =>
  api.post('/auth/register', data)

export const login = async (type, data) => {

  const res =
    type === 'username'
      ? await api.post('/auth/login', data)
      : await api.post('/auth/login-email', data)

  if (!res.data?.token) {
    throw new Error('Access token missing in response')
  }

  localStorage.setItem('accessToken', res.data.token)
  localStorage.setItem('refreshToken', res.data.refreshToken)

  authenticated = true   // ✅ IMPORTANT
  return res
}

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken')

  if (!refreshToken) {
    throw new Error('Refresh token missing')
  }
  
  const res = await api.post('/auth/refresh', { refreshToken })

  const newAccessToken = res.data.token || res.data.accessToken

  if (!newAccessToken) {
    throw new Error('New access token missing')
  }

  localStorage.setItem('accessToken', newAccessToken)
  authenticated = true

  return newAccessToken
}

export const logout = async () => {
  try {
    await api.post('/auth/logout', {
      refreshToken: localStorage.getItem('refreshToken')
    })
  } finally {
    authenticated = false    // 🔴 STOP ROUTER LOOP
    authInitialized = true
    localStorage.clear()
  }
}
