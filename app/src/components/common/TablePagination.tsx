import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Pagination } from '@/types/api'

interface TablePaginationProps {
  pagination: Pagination
  onPageChange: (page: number) => void
}

export const TablePagination = ({ pagination, onPageChange }: TablePaginationProps) => {
  const { page, total, totalPages } = pagination

  return (
    <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
      <p>
        Page {page} of {Math.max(totalPages, 1)} · {total} total
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
