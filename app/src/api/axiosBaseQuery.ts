import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { Method } from 'axios'
import { http } from '@/lib/http'
import type { ApiError } from '@/types/api'

export interface AxiosBaseQueryArgs {
  url: string
  method?: Method
  data?: unknown
  params?: object
}

const cleanParams = (params?: object) =>
  params
    ? Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value !== '' && value !== null && value !== undefined,
        ),
      )
    : undefined

export const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, ApiError> =>
  async ({ url, method = 'GET', data, params }, api) => {
    try {
      const response = await http({
        url,
        method,
        data,
        params: cleanParams(params),
        signal: api.signal,
      })
      return { data: response.status === 204 ? null : response.data }
    } catch (error) {
      return { error: error as ApiError }
    }
  }
