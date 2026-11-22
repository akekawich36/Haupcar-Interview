import { createFileRoute } from '@tanstack/react-router'
import { CarsPage } from '@/pages/cars'
import { parseCarSearch } from '@/pages/cars/constants'

export const Route = createFileRoute('/_auth/cars/')({
  validateSearch: parseCarSearch,
  component: CarsPage,
})
