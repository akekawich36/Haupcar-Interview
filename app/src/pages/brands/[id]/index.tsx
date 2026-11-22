import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { CircleAlert, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  useCreateModelMutation,
  useDeleteBrandMutation,
  useDeleteModelMutation,
  useGetBrandQuery,
  useGetModelsByBrandQuery,
  useUpdateBrandMutation,
  useUpdateModelMutation,
} from '@/api'
import type { CarModel } from '@/api'
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
import { NameFormDialog } from '../name-form-dialog'

type DialogState =
  | { type: 'renameBrand' }
  | { type: 'addModel' }
  | { type: 'editModel'; model: CarModel }
  | null

type ConfirmState = { type: 'brand' } | { type: 'model'; model: CarModel } | null

const BrandDetail = () => {
  const { brandId } = useParams({ from: '/_auth/brands/$brandId' })
  const navigate = useNavigate()

  const { data: brand, error: brandError, isLoading: isBrandLoading } = useGetBrandQuery(brandId)
  const {
    data: models = [],
    error: modelsError,
    isLoading: isModelsLoading,
    isFetching: isModelsFetching,
  } = useGetModelsByBrandQuery(brandId)

  const [updateBrand] = useUpdateBrandMutation()
  const [deleteBrand, { isLoading: isDeletingBrand }] = useDeleteBrandMutation()
  const [createModel] = useCreateModelMutation()
  const [updateModel] = useUpdateModelMutation()
  const [deleteModel, { isLoading: isDeletingModel }] = useDeleteModelMutation()

  const [dialog, setDialog] = useState<DialogState>(null)
  const [confirm, setConfirm] = useState<ConfirmState>(null)

  const goBack = () => void navigate({ to: '/brands' })
  const closeDialog = (open: boolean) => {
    if (!open) setDialog(null)
  }

  const handleRenameBrand = async (name: string) => {
    await updateBrand({ id: brandId, name }).unwrap()
    toast.success('Brand renamed')
    setDialog(null)
  }

  const handleAddModel = async (name: string) => {
    await createModel({ brandId, name }).unwrap()
    toast.success(`Model ${name} added`)
    setDialog(null)
  }

  const handleEditModel = (model: CarModel) => async (name: string) => {
    await updateModel({ brandId, id: model.id, name }).unwrap()
    toast.success('Model renamed')
    setDialog(null)
  }

  const handleConfirm = async () => {
    if (!confirm) return

    try {
      if (confirm.type === 'brand') {
        await deleteBrand(brandId).unwrap()
        toast.success(`Brand ${brand?.name ?? ''} deleted`)
        setConfirm(null)
        goBack()
        return
      }

      await deleteModel({ brandId, id: confirm.model.id }).unwrap()
      toast.success(`Model ${confirm.model.name} deleted`)
      setConfirm(null)
    } catch (deleteError) {
      toast.error((deleteError as ApiError).message)
    }
  }

  if (isBrandLoading) {
    return (
      <div className="flex min-h-56 items-center justify-center text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    )
  }

  if (brandError || !brand) {
    return (
      <>
        <PageHeader title="Brand" onBack={goBack} />
        <EmptyState
          icon={CircleAlert}
          title="Failed to load brand"
          description={brandError?.message}
          action={
            <Button variant="outline" onClick={goBack}>
              Back to brands
            </Button>
          }
        />
      </>
    )
  }

  const renderModels = () => {
    if (isModelsLoading) {
      return (
        <div className="flex min-h-40 items-center justify-center text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
        </div>
      )
    }

    if (modelsError) {
      return (
        <EmptyState
          icon={CircleAlert}
          title="Failed to load models"
          description={modelsError.message}
        />
      )
    }

    if (models.length === 0) {
      return <EmptyState title="No models yet" description="Add the first model for this brand." />
    }

    return (
      <Table className={isModelsFetching ? 'opacity-60 transition-opacity' : undefined}>
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model) => (
            <TableRow key={model.id}>
              <TableCell className="font-medium">{model.name}</TableCell>
              <TableCell>
                <ActionColumn
                  actions={[
                    {
                      label: 'Edit',
                      icon: Pencil,
                      onClick: () => setDialog({ type: 'editModel', model }),
                    },
                    {
                      label: 'Delete',
                      icon: Trash2,
                      onClick: () => setConfirm({ type: 'model', model }),
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

  const confirmProps =
    confirm?.type === 'brand'
      ? {
          title: 'Delete brand?',
          description: `${brand.name} and its ${models.length} model(s) will be deleted. Brands used by any car cannot be deleted.`,
          loading: isDeletingBrand,
        }
      : {
          title: 'Delete model?',
          description: confirm
            ? `${confirm.model.name} will be deleted. Models used by any car cannot be deleted.`
            : undefined,
          loading: isDeletingModel,
        }

  return (
    <>
      <PageHeader
        title={brand.name}
        description={`${models.length} model(s)`}
        onBack={goBack}
        actions={
          <>
            <Button variant="outline" onClick={() => setDialog({ type: 'renameBrand' })}>
              <Pencil />
              Rename
            </Button>
            <Button variant="destructive" onClick={() => setConfirm({ type: 'brand' })}>
              <Trash2 />
              Delete
            </Button>
          </>
        }
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Models</h2>
          <Button size="sm" onClick={() => setDialog({ type: 'addModel' })}>
            <Plus />
            Add model
          </Button>
        </div>
        <div className="rounded-lg border">{renderModels()}</div>
      </div>

      <NameFormDialog
        open={dialog?.type === 'renameBrand'}
        onOpenChange={closeDialog}
        title="Rename brand"
        label="Brand name"
        defaultValue={brand.name}
        submitLabel="Save"
        onSubmit={handleRenameBrand}
      />

      <NameFormDialog
        open={dialog?.type === 'addModel'}
        onOpenChange={closeDialog}
        title="Add model"
        description={`Add a new model to ${brand.name}`}
        label="Model name"
        placeholder="Yaris"
        submitLabel="Add model"
        onSubmit={handleAddModel}
      />

      <NameFormDialog
        open={dialog?.type === 'editModel'}
        onOpenChange={closeDialog}
        title="Rename model"
        label="Model name"
        defaultValue={dialog?.type === 'editModel' ? dialog.model.name : ''}
        submitLabel="Save"
        onSubmit={
          dialog?.type === 'editModel' ? handleEditModel(dialog.model) : () => Promise.resolve()
        }
      />

      <ConfirmModal
        open={confirm !== null}
        onOpenChange={(open) => {
          if (!open) setConfirm(null)
        }}
        confirmLabel="Delete"
        destructive
        onConfirm={() => void handleConfirm()}
        {...confirmProps}
      />
    </>
  )
}

export default BrandDetail
