import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: ReactNode
  className?: string
}

export const EmptyState = ({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      'flex min-h-56 flex-col items-center justify-center gap-3 px-6 py-10 text-center',
      className,
    )}
  >
    <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
      <Icon className="size-5" />
    </div>
    <div className="space-y-1">
      <p className="font-medium">{title}</p>
      {description ? <p className="max-w-sm text-sm text-muted-foreground">{description}</p> : null}
    </div>
    {action}
  </div>
)
