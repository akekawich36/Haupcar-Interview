import { CAR_STATUSES } from '@/api'
import type { CarStatus } from '@/api'

export const PAGE_SIZE = 10

export const ALL = 'all'

export const STATUS_LABELS: Record<CarStatus, string> = {
  available: 'Available',
  rented: 'Rented',
  reserved: 'Reserved',
}

export const STATUS_VARIANTS: Record<CarStatus, 'default' | 'secondary' | 'outline'> = {
  available: 'default',
  rented: 'secondary',
  reserved: 'outline',
}

export interface CarSearch {
  page?: number
  brandId?: string
  modelId?: string
  status?: CarStatus
}

const isCarStatus = (value: unknown): value is CarStatus =>
  CAR_STATUSES.includes(value as CarStatus)

const asString = (value: unknown) => (typeof value === 'string' && value ? value : undefined)

export const parseCarSearch = (search: Record<string, unknown>): CarSearch => {
  const page = Number(search.page)

  return {
    page: Number.isInteger(page) && page > 1 ? page : undefined,
    brandId: asString(search.brandId),
    modelId: asString(search.modelId),
    status: isCarStatus(search.status) ? search.status : undefined,
  }
}
