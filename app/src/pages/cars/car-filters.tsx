import { CAR_STATUSES, useGetBrandsQuery, useGetModelsByBrandQuery } from '@/api'
import type { CarStatus } from '@/api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ALL, STATUS_LABELS } from './constants'
import type { CarSearch } from './constants'

interface CarFiltersProps {
  search: CarSearch
  onChange: (filters: Omit<CarSearch, 'page'>) => void
}

const fromSelect = (value: string) => (value === ALL ? undefined : value)

export const CarFilters = ({ search, onChange }: CarFiltersProps) => {
  const { brandId, modelId, status } = search
  const { data: brands = [], isLoading: isBrandsLoading } = useGetBrandsQuery()
  const { data: models = [], isFetching: isModelsFetching } = useGetModelsByBrandQuery(
    brandId ?? '',
    { skip: !brandId },
  )

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={brandId ?? ALL}
        disabled={isBrandsLoading}
        onValueChange={(value) => onChange({ brandId: fromSelect(value), status })}
      >
        <SelectTrigger className="w-48" aria-label="Brand">
          <SelectValue placeholder="Brand" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All brands</SelectItem>
          {brands.map((brand) => (
            <SelectItem key={brand.id} value={brand.id}>
              {brand.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={modelId ?? ALL}
        disabled={!brandId || isModelsFetching}
        onValueChange={(value) => onChange({ brandId, modelId: fromSelect(value), status })}
      >
        <SelectTrigger className="w-48" aria-label="Model">
          <SelectValue placeholder="Model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All models</SelectItem>
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={status ?? ALL}
        onValueChange={(value) =>
          onChange({ brandId, modelId, status: fromSelect(value) as CarStatus | undefined })
        }
      >
        <SelectTrigger className="w-40" aria-label="Status">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All statuses</SelectItem>
          {CAR_STATUSES.map((value) => (
            <SelectItem key={value} value={value}>
              {STATUS_LABELS[value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
