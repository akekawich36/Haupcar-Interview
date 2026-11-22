import { baseApi } from './baseApi'

export interface Brand {
  id: string
  name: string
}

export interface BrandListItem extends Brand {
  modelCount: number
}

export interface CarModel {
  id: string
  name: string
  brandId: string
}

export interface UpdateBrandBody {
  id: string
  name: string
}

export interface CreateModelBody {
  brandId: string
  name: string
}

export interface UpdateModelBody extends CreateModelBody {
  id: string
}

export interface DeleteModelArgs {
  brandId: string
  id: string
}

export const brandApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Brand', 'Car'] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getBrands: builder.query<BrandListItem[], void>({
        query: () => ({ url: '/brands' }),
        providesTags: ['Brand'],
      }),

      getBrand: builder.query<Brand, string>({
        query: (brandId) => ({ url: `/brands/${brandId}` }),
        providesTags: (_result, _error, brandId) => [{ type: 'Brand', id: brandId }],
      }),

      createBrand: builder.mutation<Brand, { name: string }>({
        query: (data) => ({ url: '/brands', method: 'POST', data }),
        invalidatesTags: ['Brand'],
      }),

      updateBrand: builder.mutation<Brand, UpdateBrandBody>({
        query: ({ id, ...data }) => ({ url: `/brands/${id}`, method: 'PUT', data }),
        invalidatesTags: ['Brand', 'Car'],
      }),

      deleteBrand: builder.mutation<null, string>({
        query: (brandId) => ({ url: `/brands/${brandId}`, method: 'DELETE' }),
        invalidatesTags: ['Brand'],
      }),

      getModelsByBrand: builder.query<CarModel[], string>({
        query: (brandId) => ({ url: `/brands/${brandId}/models` }),
        providesTags: (_result, _error, brandId) => [{ type: 'Brand', id: brandId }],
      }),

      createModel: builder.mutation<CarModel, CreateModelBody>({
        query: ({ brandId, ...data }) => ({
          url: `/brands/${brandId}/models`,
          method: 'POST',
          data,
        }),
        invalidatesTags: ['Brand'],
      }),

      updateModel: builder.mutation<CarModel, UpdateModelBody>({
        query: ({ brandId, id, ...data }) => ({
          url: `/brands/${brandId}/models/${id}`,
          method: 'PUT',
          data,
        }),
        invalidatesTags: ['Brand', 'Car'],
      }),

      deleteModel: builder.mutation<null, DeleteModelArgs>({
        query: ({ brandId, id }) => ({
          url: `/brands/${brandId}/models/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Brand'],
      }),
    }),
  })

export const {
  useGetBrandsQuery,
  useGetBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useGetModelsByBrandQuery,
  useCreateModelMutation,
  useUpdateModelMutation,
  useDeleteModelMutation,
} = brandApi
