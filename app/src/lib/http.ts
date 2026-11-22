import axios from 'axios'
import type { AxiosError } from 'axios'
import type { ApiError, ApiErrorBody } from '@/types/api'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<Partial<ApiErrorBody> | undefined>) => {
    const { response } = error

    const apiError: ApiError = {
      status: response?.status,
      message: response
        ? (response.data?.error ?? 'Something went wrong')
        : 'Unable to reach the server',
      details: response?.data?.details,
    }

    return Promise.reject(apiError)
  },
)
