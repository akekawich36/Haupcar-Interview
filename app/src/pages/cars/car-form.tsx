import { useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBlocker } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { CAR_STATUSES, useGetBrandsQuery, useGetModelsByBrandQuery } from '@/api'
import { DiscardModal } from '@/components'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { ApiError } from '@/types/api'
import { STATUS_LABELS } from './constants'
import { carFormSchema } from './schema'
import type { CarFormValues } from './schema'

interface CarFormProps {
  defaultValues: CarFormValues
  showStatus?: boolean
  submitLabel: string
  onSubmit: (values: CarFormValues) => Promise<void>
  onCancel: () => void
}

const isFormField = (key: string): key is keyof CarFormValues => key in carFormSchema.shape

export const CarForm = ({
  defaultValues,
  showStatus = false,
  submitLabel,
  onSubmit,
  onCancel,
}: CarFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues,
  })

  const isSavedRef = useRef(false)
  const blocker = useBlocker({
    shouldBlockFn: () => isDirty && !isSavedRef.current,
    enableBeforeUnload: isDirty,
    withResolver: true,
  })

  const brandId = useWatch({ control, name: 'brandId' })
  const { data: brands = [], isLoading: isBrandsLoading } = useGetBrandsQuery()
  const { data: models = [], isFetching: isModelsFetching } = useGetModelsByBrandQuery(brandId, {
    skip: !brandId,
  })

  const applyApiError = (error: ApiError) => {
    const fieldErrors = Object.entries(error.details ?? {}).filter(([key]) => isFormField(key))

    if (fieldErrors.length > 0) {
      fieldErrors.forEach(([key, message]) => setError(key as keyof CarFormValues, { message }))
      return
    }

    if (error.status === 409) {
      setError('licensePlate', { message: error.message })
      return
    }

    setError('root', { message: error.message })
  }

  const submit = handleSubmit(async (values) => {
    isSavedRef.current = true
    try {
      await onSubmit(values)
    } catch (error) {
      isSavedRef.current = false
      applyApiError(error as ApiError)
    }
  })

  return (
    <form onSubmit={submit} noValidate className="space-y-6 rounded-lg border p-4 md:p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Controller
          control={control}
          name="brandId"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="brandId">Brand</FieldLabel>
              <Select
                value={field.value}
                disabled={isBrandsLoading}
                onValueChange={(value) => {
                  field.onChange(value)
                  setValue('modelId', '')
                }}
              >
                <SelectTrigger id="brandId" aria-invalid={fieldState.invalid} className="w-full">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          control={control}
          name="modelId"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="modelId">Model</FieldLabel>
              <Select
                value={field.value}
                disabled={!brandId || isModelsFetching}
                onValueChange={field.onChange}
              >
                <SelectTrigger id="modelId" aria-invalid={fieldState.invalid} className="w-full">
                  <SelectValue placeholder={brandId ? 'Select model' : 'Select brand first'} />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Field data-invalid={!!errors.licensePlate}>
          <FieldLabel htmlFor="licensePlate">License plate</FieldLabel>
          <Input
            id="licensePlate"
            placeholder="1กข 1234"
            aria-invalid={!!errors.licensePlate}
            {...register('licensePlate')}
          />
          <FieldError errors={[errors.licensePlate]} />
        </Field>

        <Field data-invalid={!!errors.province}>
          <FieldLabel htmlFor="province">Province</FieldLabel>
          <Input
            id="province"
            placeholder="กรุงเทพมหานคร"
            aria-invalid={!!errors.province}
            {...register('province')}
          />
          <FieldError errors={[errors.province]} />
        </Field>

        <Field data-invalid={!!errors.color}>
          <FieldLabel htmlFor="color">Color</FieldLabel>
          <Input
            id="color"
            placeholder="White"
            aria-invalid={!!errors.color}
            {...register('color')}
          />
          <FieldError errors={[errors.color]} />
        </Field>

        {showStatus ? (
          <Controller
            control={control}
            name="status"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="status">Status</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="status" aria-invalid={fieldState.invalid} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CAR_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        ) : null}

        <Field data-invalid={!!errors.note} className="md:col-span-2">
          <FieldLabel htmlFor="note">Note</FieldLabel>
          <Textarea id="note" rows={3} aria-invalid={!!errors.note} {...register('note')} />
          <FieldError errors={[errors.note]} />
        </Field>
      </div>

      <FieldError errors={[errors.root]} />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isDirty || isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          {submitLabel}
        </Button>
      </div>

      <DiscardModal
        open={blocker.status === 'blocked'}
        onOpenChange={(open) => {
          if (!open && blocker.status === 'blocked') blocker.reset()
        }}
        onConfirm={() => {
          if (blocker.status === 'blocked') blocker.proceed()
        }}
      />
    </form>
  )
}
