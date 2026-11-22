import { useNavigate, useSearch } from '@tanstack/react-router'
import { CircleAlert, Loader2 } from 'lucide-react'
import { useGetCarsQuery } from '@/api'
import { EmptyState, PageHeader, TablePagination } from '@/components'
import { CarFilters } from './car-filters'
import { CarTable } from './car-table'
import { PAGE_SIZE } from './constants'
import type { CarSearch } from './constants'

export const CarsPage = () => {
  const search = useSearch({ from: '/_auth/cars/' })
  const navigate = useNavigate({ from: '/cars/' })
  const page = search.page ?? 1

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
        />
      </div>
    )
  }

  return (
    <>
      <PageHeader title="Cars" description="Manage cars in the fleet" />
      <CarFilters search={search} onChange={handleFiltersChange} />
      <div className="rounded-lg border">{renderContent()}</div>
      {data && data.items.length > 0 ? (
        <TablePagination pagination={data.pagination} onPageChange={handlePageChange} />
      ) : null}
    </>
  )
}
