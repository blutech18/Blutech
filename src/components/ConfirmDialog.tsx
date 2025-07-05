import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  itemName?: string;
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  type = 'danger',
  itemName,
  loading = false
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconColor: 'text-red-400',
          iconBg: 'bg-red-500/20',
          buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          borderColor: 'border-red-500/30'
        };
      case 'warning':
        return {
          iconColor: 'text-yellow-400',
          iconBg: 'bg-yellow-500/20',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          borderColor: 'border-yellow-500/30'
        };
      case 'info':
        return {
          iconColor: 'text-blue-400',
          iconBg: 'bg-blue-500/20',
          buttonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          borderColor: 'border-blue-500/30'
        };
    }
  };

  const styles = getTypeStyles();

  const handleConfirm = () => {
    onConfirm();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      handleConfirm();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`bg-navy-800 border ${styles.borderColor} rounded-xl shadow-2xl max-w-md w-full mx-4`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center mr-3`}>
                  {type === 'danger' ? (
                    <Trash2 className={`w-5 h-5 ${styles.iconColor}`} />
                  ) : (
                    <AlertTriangle className={`w-5 h-5 ${styles.iconColor}`} />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 pb-4">
              <p className="text-gray-300 leading-relaxed">
                {message}
              </p>
              {itemName && (
                <div className="mt-3 p-3 bg-navy-700/50 rounded-lg border border-navy-600">
                  <p className="text-sm text-gray-400 mb-1">Item to be deleted:</p>
                  <p className="text-white font-medium truncate">{itemName}</p>
                </div>
              )}
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-200 text-sm flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 p-6 pt-2 border-t border-navy-700">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`px-6 py-2 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-800 disabled:opacity-50 disabled:cursor-not-allowed ${styles.buttonColor} ${
                  loading ? 'cursor-wait' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Deleting...
                  </div>
                ) : (
                  confirmText
                )}
              </button>
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="px-6 pb-4">
              <p className="text-xs text-gray-500 text-center">
                Press <kbd className="px-1 py-0.5 bg-navy-700 rounded text-xs">Esc</kbd> to cancel or{' '}
                <kbd className="px-1 py-0.5 bg-navy-700 rounded text-xs">Ctrl</kbd> +{' '}
                <kbd className="px-1 py-0.5 bg-navy-700 rounded text-xs">Enter</kbd> to confirm
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog; 