import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useCreateCarMutation } from '@/api'
import { PageHeader } from '@/components'
import { CarForm } from '../car-form'
import { EMPTY_CAR_FORM, toCarBody } from '../schema'
import type { CarFormValues } from '../schema'

export const CarCreatePage = () => {
  const navigate = useNavigate()
  const [createCar] = useCreateCarMutation()

  const goBack = () => void navigate({ to: '/cars' })

  const handleSubmit = async (values: CarFormValues) => {
    await createCar(toCarBody(values)).unwrap()
    toast.success('Car created')
    goBack()
  }

  return (
    <>
      <PageHeader title="Add car" description="Register a new car in the fleet" onBack={goBack} />
      <CarForm
        defaultValues={EMPTY_CAR_FORM}
        submitLabel="Create car"
        onSubmit={handleSubmit}
        onCancel={goBack}
      />
    </>
  )
}
