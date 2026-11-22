import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { ApiError } from '@/types/api'

const nameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(255, 'Name must be at most 255 characters'),
})

type NameFormValues = z.infer<typeof nameSchema>

interface NameFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  label: string
  placeholder?: string
  defaultValue?: string
  submitLabel: string
  onSubmit: (name: string) => Promise<void>
}

interface NameFormProps extends Omit<NameFormDialogProps, 'open' | 'title' | 'description'> {}

const NameForm = ({
  onOpenChange,
  label,
  placeholder,
  defaultValue = '',
  submitLabel,
  onSubmit,
}: NameFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<NameFormValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: defaultValue },
  })

  const submit = handleSubmit(async ({ name }) => {
    try {
      await onSubmit(name)
    } catch (error) {
      const { status, message, details } = error as ApiError
      const isNameError = Boolean(details?.name) || status === 409
      setError(isNameError ? 'name' : 'root', { message: details?.name ?? message })
    }
  })

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="name">{label}</FieldLabel>
        <Input
          id="name"
          autoFocus
          placeholder={placeholder}
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        <FieldError errors={[errors.name]} />
      </Field>

      <FieldError errors={[errors.root]} />

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!isDirty || isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  )
}

export const NameFormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  ...formProps
}: NameFormDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description ? <DialogDescription>{description}</DialogDescription> : null}
      </DialogHeader>
      <NameForm onOpenChange={onOpenChange} {...formProps} />
    </DialogContent>
  </Dialog>
)
