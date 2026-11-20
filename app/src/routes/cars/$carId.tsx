import { createFileRoute } from '@tanstack/react-router'
import CarDetail from '#/pages/cars/[id]'

export const Route = createFileRoute('/cars/$carId')({
  component: CarDetail,
})
