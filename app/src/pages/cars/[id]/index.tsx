import { useNavigate } from '@tanstack/react-router'
import { PageHeader } from '@/components'

const CarDetail = () => {
  const navigate = useNavigate()

  return <PageHeader title="Car Detail" onBack={() => void navigate({ to: '/cars' })} />
}

export default CarDetail
