import { baseApi } from './baseApi'

export interface Brand {
  id: string
  name: string
}

export interface CarModel {
  id: string
  name: string
  brandId: string
}

export const brandApi = baseApi.enhanceEndpoints({ addTagTypes: ['Brand'] }).injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<Brand[], void>({
      query: () => ({ url: '/brands' }),
      providesTags: ['Brand'],
    }),

    getModelsByBrand: builder.query<CarModel[], string>({
      query: (brandId) => ({ url: `/brands/${brandId}/models` }),
      providesTags: (_result, _error, brandId) => [{ type: 'Brand', id: brandId }],
    }),
  }),
})

export const { useGetBrandsQuery, useGetModelsByBrandQuery } = brandApi
