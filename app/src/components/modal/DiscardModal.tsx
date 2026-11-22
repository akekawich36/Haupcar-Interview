import { ConfirmModal } from './ConfirmModal'

interface DiscardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export const DiscardModal = ({ open, onOpenChange, onConfirm }: DiscardModalProps) => (
  <ConfirmModal
    open={open}
    onOpenChange={onOpenChange}
    title="Discard changes?"
    description="You have unsaved changes. If you leave now, they will be lost."
    confirmLabel="Discard"
    cancelLabel="Keep editing"
    destructive
    onConfirm={onConfirm}
  />
)
