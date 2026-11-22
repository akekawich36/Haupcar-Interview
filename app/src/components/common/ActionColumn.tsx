import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export interface RowAction {
  label: string
  icon: LucideIcon
  onClick?: () => void
  destructive?: boolean
}

interface ActionColumnProps {
  actions: RowAction[]
}

export const ActionColumn = ({ actions }: ActionColumnProps) => (
  <div className="flex items-center justify-end gap-1">
    {actions.map(({ label, icon: Icon, onClick, destructive }) => (
      <Tooltip key={label}>
        <TooltipTrigger asChild>
          <span tabIndex={onClick ? undefined : 0}>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={label}
              disabled={!onClick}
              onClick={onClick}
              className={cn(
                destructive && 'text-destructive hover:bg-destructive/10 hover:text-destructive',
              )}
            >
              <Icon />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    ))}
  </div>
)
