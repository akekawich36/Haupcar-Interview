export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiList<T> {
  items: T[]
  pagination: Pagination
}

export interface ApiErrorBody {
  error: string
  details?: Record<string, string>
}

export interface ApiError {
  status?: number
  message: string
  details?: Record<string, string>
}
