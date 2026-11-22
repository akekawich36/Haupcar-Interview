import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface PageHeaderProps {
  title: string
  description?: string
  onBack?: () => void
  actions?: ReactNode
  className?: string
}

export const PageHeader = ({ title, description, onBack, actions, className }: PageHeaderProps) => (
  <div className={cn('flex flex-wrap items-start justify-between gap-3', className)}>
    <div className="flex items-start gap-2">
      {onBack ? (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onBack}
          aria-label="Back"
          className="mt-0.5 shrink-0"
        >
          <ArrowLeft />
        </Button>
      ) : null}

      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
    </div>

    {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
  </div>
)
