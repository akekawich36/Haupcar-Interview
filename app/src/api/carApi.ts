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

export interface CarDetail extends Car {
  createdAt: string
  updatedAt: string
}

export type SavedCar = Omit<CarDetail, 'Brand' | 'CarModel'>

export interface CarListParams {
  page: number
  limit: number
  brandId?: string
  modelId?: string
  status?: CarStatus
}

export interface CreateCarBody {
  brandId: string
  modelId: string
  color: string
  licensePlate: string
  province: string
  note: string | null
}

export interface UpdateCarBody extends CreateCarBody {
  id: string
  status: CarStatus
}

export const carApi = baseApi.enhanceEndpoints({ addTagTypes: ['Car'] }).injectEndpoints({
  endpoints: (builder) => ({
    getCars: builder.query<ApiList<Car>, CarListParams>({
      query: (params) => ({ url: '/cars', params }),
      providesTags: ['Car'],
    }),

    getCar: builder.query<CarDetail, string>({
      query: (id) => ({ url: `/cars/${id}` }),
      providesTags: (_result, _error, id) => [{ type: 'Car', id }],
    }),

    createCar: builder.mutation<SavedCar, CreateCarBody>({
      query: (data) => ({ url: '/cars', method: 'POST', data }),
      invalidatesTags: ['Car'],
    }),

    updateCar: builder.mutation<SavedCar, UpdateCarBody>({
      query: ({ id, ...data }) => ({ url: `/cars/${id}`, method: 'PUT', data }),
      invalidatesTags: ['Car'],
    }),

    deleteCar: builder.mutation<null, string>({
      query: (id) => ({ url: `/cars/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Car'],
    }),
  }),
})

export const {
  useGetCarsQuery,
  useGetCarQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation,
} = carApi
