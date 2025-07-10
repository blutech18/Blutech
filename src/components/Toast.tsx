import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-400" />;
      case 'info':
        return <Info className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-400" />;
      default:
        return <Info className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-400" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-l-green-500';
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'info':
        return 'border-l-blue-500';
      default:
        return 'border-l-blue-500';
    }
  };

  const getProgressColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`relative bg-navy-800 border ${getBorderColor()} border-l-4 rounded-lg shadow-xl backdrop-blur-sm w-full overflow-hidden`}
        >
          {/* Progress bar */}
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: (toast.duration || 5000) / 1000, ease: 'linear' }}
            className={`absolute top-0 left-0 h-1 ${getProgressColor()}`}
          />
          
          <div className="p-3 sm:p-4 lg:p-5">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-white leading-tight">
                  {toast.title}
                </p>
                {toast.message && (
                  <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm lg:text-base text-gray-300 leading-relaxed line-clamp-3">
                    {toast.message}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                <button
                  className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-navy-800 rounded-full"
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => onRemove(toast.id), 300);
                  }}
                  aria-label="Close notification"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast; 