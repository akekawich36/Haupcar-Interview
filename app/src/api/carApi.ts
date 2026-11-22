import type { ApiList } from '@/types/api'
import { baseApi } from './baseApi'

export const CAR_STATUSES = ['available', 'rented', 'reserved'] as const
export type CarStatus = (typeof CAR_STATUSES)[number]

export interface Car {
  id: string
  brandId: string
  modelId: string
  color: string
  licensePlate: string
  province: string
  status: CarStatus
  note: string | null
  Brand: { name: string } | null
  CarModel: { name: string } | null
}

export interface CarListParams {
  page: number
  limit: number
  brandId?: string
  modelId?: string
  status?: CarStatus
}

export const carApi = baseApi.enhanceEndpoints({ addTagTypes: ['Car'] }).injectEndpoints({
  endpoints: (builder) => ({
    getCars: builder.query<ApiList<Car>, CarListParams>({
      query: (params) => ({ url: '/cars', params }),
      providesTags: ['Car'],
    }),
  }),
})

export const { useGetCarsQuery } = carApi
