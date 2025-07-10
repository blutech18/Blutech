import React from 'react';
import { createPortal } from 'react-dom';
import Toast, { ToastMessage } from './Toast';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return createPortal(
    <div className="fixed top-4 sm:top-6 lg:top-8 right-2 sm:right-4 lg:right-6 xl:right-8 z-[9999] space-y-3 sm:space-y-4 pointer-events-none max-w-[calc(100vw-1rem)] sm:max-w-md lg:max-w-lg">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer; 