import { createFileRoute } from '@tanstack/react-router'
import { CarCreatePage } from '@/pages/cars/create'

export const Route = createFileRoute('/_auth/cars/create')({ component: CarCreatePage })
