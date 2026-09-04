import axios from 'axios'
import { getAccessToken, refreshToken, logout } from './auth'
import { showToast } from './toastService'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

export const BASE_API_URL = import.meta.env.VITE_API_URL

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

/* ================= REQUEST ================= */
api.interceptors.request.use(config => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/* ================= RESPONSE ================= */
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    const status = error.response?.status

    if ((status === 401 || status === 403) && !originalRequest._retry) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newToken = await refreshToken()
        processQueue(null, newToken)

        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)

      } catch (err) {
        processQueue(err, null)

        await logout()   // 🔴 IMPORTANT
        showToast('Session expired. Please login again.', 'error')

        window.location.replace('/login') // 🔴 HARD STOP
        return Promise.reject(err)

      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
