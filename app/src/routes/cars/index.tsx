import { createFileRoute } from '@tanstack/react-router'
import { CarsPage } from '@/pages/cars'

export const Route = createFileRoute('/cars/')({ component: CarsPage })
