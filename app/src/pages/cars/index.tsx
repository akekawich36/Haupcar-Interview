import { useState } from 'react'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { CircleAlert, Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useDeleteCarMutation, useGetCarsQuery } from '@/api'
import type { Car } from '@/api'
import { ConfirmModal, EmptyState, PageHeader, TablePagination } from '@/components'
import { Button } from '@/components/ui/button'
import type { ApiError } from '@/types/api'
import { CarFilters } from './car-filters'
import { CarTable } from './car-table'
import { PAGE_SIZE } from './constants'
import type { CarSearch } from './constants'

export const CarsPage = () => {
  const search = useSearch({ from: '/_auth/cars/' })
  const navigate = useNavigate({ from: '/cars/' })
  const page = search.page ?? 1
  const [carToDelete, setCarToDelete] = useState<Car | null>(null)
  const [deleteCar, { isLoading: isDeleting }] = useDeleteCarMutation()

  const { data, error, isLoading, isFetching } = useGetCarsQuery({
    page,
    limit: PAGE_SIZE,
    brandId: search.brandId,
    modelId: search.modelId,
    status: search.status,
  })

  const handleFiltersChange = (filters: Omit<CarSearch, 'page'>) =>
    void navigate({ search: filters })

  const handlePageChange = (nextPage: number) =>
    void navigate({
      search: (prev) => ({ ...prev, page: nextPage > 1 ? nextPage : undefined }),
    })

  const handleDelete = async () => {
    if (!carToDelete) return

    try {
      await deleteCar(carToDelete.id).unwrap()
      toast.success(`Car ${carToDelete.licensePlate} deleted`)
      setCarToDelete(null)
      if (data?.items.length === 1 && page > 1) handlePageChange(page - 1)
    } catch (deleteError) {
      toast.error((deleteError as ApiError).message)
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex min-h-56 items-center justify-center text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      )
    }

    if (error) {
      return (
        <EmptyState icon={CircleAlert} title="Failed to load cars" description={error.message} />
      )
    }

    if (!data || data.items.length === 0) {
      return <EmptyState title="No cars found" />
    }

    return (
      <div className={isFetching ? 'opacity-60 transition-opacity' : undefined}>
        <CarTable
          cars={data.items}
          onEdit={(car) => void navigate({ to: '/cars/$carId', params: { carId: car.id } })}
          onDelete={setCarToDelete}
        />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Cars"
        description="Manage cars in the fleet"
        actions={
          <Button asChild>
            <Link to="/cars/create">
              <Plus />
              Add car
            </Link>
          </Button>
        }
      />
      <CarFilters search={search} onChange={handleFiltersChange} />
      <div className="rounded-lg border">{renderContent()}</div>
      {data && data.items.length > 0 ? (
        <TablePagination pagination={data.pagination} onPageChange={handlePageChange} />
      ) : null}
      <ConfirmModal
        open={carToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setCarToDelete(null)
        }}
        title="Delete car?"
        description={
          carToDelete
            ? `${carToDelete.licensePlate} · ${carToDelete.province} will be removed from the fleet.`
            : undefined
        }
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
        onConfirm={() => void handleDelete()}
      />
    </>
  )
}
