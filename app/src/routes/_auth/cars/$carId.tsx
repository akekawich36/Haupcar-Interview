import { createFileRoute } from '@tanstack/react-router'
import CarDetail from '#/pages/cars/[id]'

export const Route = createFileRoute('/_auth/cars/$carId')({
  component: CarDetail,
})
