import { z } from 'zod'
import { CAR_STATUSES } from '@/api'
import type { CarDetail, CreateCarBody } from '@/api'

export const carFormSchema = z.object({
  brandId: z.string().min(1, 'Brand is required'),
  modelId: z.string().min(1, 'Model is required'),
  licensePlate: z
    .string()
    .trim()
    .min(1, 'License plate is required')
    .max(20, 'License plate must be at most 20 characters'),
  province: z
    .string()
    .trim()
    .min(1, 'Province is required')
    .max(100, 'Province must be at most 100 characters'),
  color: z
    .string()
    .trim()
    .min(1, 'Color is required')
    .max(50, 'Color must be at most 50 characters'),
  status: z.enum(CAR_STATUSES),
  note: z.string().trim(),
})

export type CarFormValues = z.infer<typeof carFormSchema>

export const EMPTY_CAR_FORM: CarFormValues = {
  brandId: '',
  modelId: '',
  licensePlate: '',
  province: '',
  color: '',
  status: 'available',
  note: '',
}

export const toCarFormValues = (car: CarDetail): CarFormValues => ({
  brandId: car.brandId,
  modelId: car.modelId,
  licensePlate: car.licensePlate,
  province: car.province,
  color: car.color,
  status: car.status,
  note: car.note ?? '',
})

export const toCarBody = (values: CarFormValues): CreateCarBody => ({
  brandId: values.brandId,
  modelId: values.modelId,
  licensePlate: values.licensePlate,
  province: values.province,
  color: values.color,
  note: values.note || null,
})
