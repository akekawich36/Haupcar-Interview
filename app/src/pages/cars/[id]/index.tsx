import { useNavigate, useParams } from '@tanstack/react-router'
import { CircleAlert, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useGetCarQuery, useUpdateCarMutation } from '@/api'
import { EmptyState, PageHeader } from '@/components'
import { Button } from '@/components/ui/button'
import { CarForm } from '../car-form'
import { toCarBody, toCarFormValues } from '../schema'
import type { CarFormValues } from '../schema'

const CarDetail = () => {
  const { carId } = useParams({ from: '/_auth/cars/$carId' })
  const navigate = useNavigate()
  const { data: car, error, isLoading } = useGetCarQuery(carId)
  const [updateCar] = useUpdateCarMutation()

  const goBack = () => void navigate({ to: '/cars' })

  const handleSubmit = async (values: CarFormValues) => {
    await updateCar({ id: carId, status: values.status, ...toCarBody(values) }).unwrap()
    toast.success('Car updated')
    goBack()
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex min-h-56 items-center justify-center text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      )
    }

    if (error || !car) {
      return (
        <EmptyState
          icon={CircleAlert}
          title="Failed to load car"
          description={error?.message}
          action={
            <Button variant="outline" onClick={goBack}>
              Back to cars
            </Button>
          }
        />
      )
    }

    return (
      <CarForm
        key={car.id}
        defaultValues={toCarFormValues(car)}
        showStatus
        submitLabel="Save changes"
        onSubmit={handleSubmit}
        onCancel={goBack}
      />
    )
  }

  return (
    <>
      <PageHeader
        title="Car Detail"
        description={car ? `${car.licensePlate} · ${car.province}` : undefined}
        onBack={goBack}
      />
      {renderContent()}
    </>
  )
}

export default CarDetail
