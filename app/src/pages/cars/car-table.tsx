import { Pencil, Trash2 } from 'lucide-react'
import type { Car } from '@/api'
import { ActionColumn } from '@/components'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { STATUS_LABELS, STATUS_VARIANTS } from './constants'

interface CarTableProps {
  cars: Car[]
  onEdit?: (car: Car) => void
  onDelete?: (car: Car) => void
}

export const CarTable = ({ cars, onEdit, onDelete }: CarTableProps) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>License plate</TableHead>
        <TableHead>Province</TableHead>
        <TableHead>Brand</TableHead>
        <TableHead>Model</TableHead>
        <TableHead>Color</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Note</TableHead>
        <TableHead className="w-24 text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {cars.map((car) => (
        <TableRow key={car.id}>
          <TableCell className="font-medium">{car.licensePlate}</TableCell>
          <TableCell>{car.province}</TableCell>
          <TableCell>{car.Brand?.name ?? '-'}</TableCell>
          <TableCell>{car.CarModel?.name ?? '-'}</TableCell>
          <TableCell>{car.color}</TableCell>
          <TableCell>
            <Badge variant={STATUS_VARIANTS[car.status]}>{STATUS_LABELS[car.status]}</Badge>
          </TableCell>
          <TableCell className="max-w-xs truncate text-muted-foreground">
            {car.note ?? '-'}
          </TableCell>
          <TableCell>
            <ActionColumn
              actions={[
                {
                  label: 'Edit',
                  icon: Pencil,
                  onClick: onEdit ? () => onEdit(car) : undefined,
                },
                {
                  label: 'Delete',
                  icon: Trash2,
                  onClick: onDelete ? () => onDelete(car) : undefined,
                  destructive: true,
                },
              ]}
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)
