import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { Button, buttonVariants } from './button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
}) => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    },
    [onClose, closeOnEscape]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-base/80 backdrop-blur-sm animate-fade-in"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`relative w-full ${sizeClasses[size]} bg-dark-card rounded-3xl shadow-2xl border border-dark-border animate-scale-in`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 pb-0">
            <div>
              {title && (
                <h2 id="modal-title" className="text-xl font-serif font-semibold text-text-primary">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="text-text-secondary mt-1">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-dark-hover transition-colors text-text-muted hover:text-text-primary"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Confirmation dialog
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  isLoading = false,
}) => {
  const confirmVariant = variant === 'danger' ? 'destructive' : variant === 'warning' ? 'secondary' : 'default';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center">
        <h3 className="text-xl font-serif font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary mb-6">{description}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Delete confirmation
interface DeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  itemName?: string;
  isLoading?: boolean;
}

export const DeleteConfirm: React.FC<DeleteConfirmProps> = ({
  isOpen,
  onClose,
  onDelete,
  itemName = 'this item',
  isLoading = false,
}) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onDelete}
    title={`Delete ${itemName}?`}
    description={`Are you sure you want to delete ${itemName}? This action cannot be undone.`}
    confirmLabel="Delete"
    variant="danger"
    isLoading={isLoading}
  />
);

// Discard changes confirmation
interface DiscardChangesProps {
  isOpen: boolean;
  onClose: () => void;
  onDiscard: () => void;
}

export const DiscardChanges: React.FC<DiscardChangesProps> = ({ isOpen, onClose, onDiscard }) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onDiscard}
    title="Discard changes?"
    description="You have unsaved changes. Are you sure you want to discard them?"
    confirmLabel="Discard"
    cancelLabel="Keep Editing"
    variant="warning"
  />
);

export default Modal;
