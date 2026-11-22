import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { CircleAlert, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateBrandMutation, useDeleteBrandMutation, useGetBrandsQuery } from '@/api'
import type { BrandListItem } from '@/api'
import { ActionColumn, ConfirmModal, EmptyState, PageHeader } from '@/components'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ApiError } from '@/types/api'
import { NameFormDialog } from './name-form-dialog'

export const BrandsPage = () => {
  const navigate = useNavigate()
  const { data: brands = [], error, isLoading, isFetching } = useGetBrandsQuery()
  const [createBrand] = useCreateBrandMutation()
  const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [brandToDelete, setBrandToDelete] = useState<BrandListItem | null>(null)

  const handleCreate = async (name: string) => {
    const brand = await createBrand({ name }).unwrap()
    toast.success(`Brand ${brand.name} created`)
    setIsCreateOpen(false)
    void navigate({ to: '/brands/$brandId', params: { brandId: brand.id } })
  }

  const handleDelete = async () => {
    if (!brandToDelete) return

    try {
      await deleteBrand(brandToDelete.id).unwrap()
      toast.success(`Brand ${brandToDelete.name} deleted`)
      setBrandToDelete(null)
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
        <EmptyState icon={CircleAlert} title="Failed to load brands" description={error.message} />
      )
    }

    if (brands.length === 0) {
      return <EmptyState title="No brands yet" />
    }

    return (
      <Table className={isFetching ? 'opacity-60 transition-opacity' : undefined}>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Models</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((brand) => (
            <TableRow key={brand.id}>
              <TableCell className="font-medium">
                <Link
                  to="/brands/$brandId"
                  params={{ brandId: brand.id }}
                  className="hover:underline"
                >
                  {brand.name}
                </Link>
              </TableCell>
              <TableCell>{brand.modelCount}</TableCell>
              <TableCell>
                <ActionColumn
                  actions={[
                    {
                      label: 'Edit',
                      icon: Pencil,
                      onClick: () =>
                        void navigate({ to: '/brands/$brandId', params: { brandId: brand.id } }),
                    },
                    {
                      label: 'Delete',
                      icon: Trash2,
                      onClick: () => setBrandToDelete(brand),
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
  }

  return (
    <>
      <PageHeader
        title="Brands"
        description="Manage car brands and models"
        actions={
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus />
            Add brand
          </Button>
        }
      />
      <div className="rounded-lg border">{renderContent()}</div>

      <NameFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Add brand"
        label="Brand name"
        placeholder="Suzuki"
        submitLabel="Create brand"
        onSubmit={handleCreate}
      />

      <ConfirmModal
        open={brandToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setBrandToDelete(null)
        }}
        title="Delete brand?"
        description={
          brandToDelete
            ? `${brandToDelete.name} and its ${brandToDelete.modelCount} model(s) will be deleted. Brands used by any car cannot be deleted.`
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
