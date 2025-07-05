import { useState, useCallback } from 'react';

interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  itemName?: string;
}

interface ConfirmDialogState extends ConfirmDialogConfig {
  isOpen: boolean;
  loading: boolean;
}

export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = useState<ConfirmDialogState>({
    isOpen: false,
    loading: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'danger'
  });

  const [confirmAction, setConfirmAction] = useState<(() => Promise<void>) | null>(null);

  const showConfirmDialog = useCallback((config: ConfirmDialogConfig, onConfirm: () => Promise<void>) => {
    setDialogState({
      isOpen: true,
      loading: false,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      ...config
    });
    setConfirmAction(() => onConfirm);
  }, []);

  const hideConfirmDialog = useCallback(() => {
    setDialogState(prev => ({ ...prev, isOpen: false, loading: false }));
    setConfirmAction(null);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!confirmAction) return;

    setDialogState(prev => ({ ...prev, loading: true }));
    
    try {
      await confirmAction();
      hideConfirmDialog();
    } catch (error) {
      setDialogState(prev => ({ ...prev, loading: false }));
      // Error handling is done in the calling component
    }
  }, [confirmAction, hideConfirmDialog]);

  return {
    dialogState,
    showConfirmDialog,
    hideConfirmDialog,
    handleConfirm
  };
}; 