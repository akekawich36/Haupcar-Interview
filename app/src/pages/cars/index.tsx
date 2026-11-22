import { EmptyState, PageHeader } from '@/components'

export const CarsPage = () => (
  <>
    <PageHeader title="Cars" description="Manage cars in the fleet" />
    <EmptyState title="No cars yet" />
  </>
)
