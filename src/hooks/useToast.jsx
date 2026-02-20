import { toast } from 'react-hot-toast';

/**
 * useToast - Custom hook that provides toast notification functions
 * 
 * @returns {Object} Toast notification functions
 * 
 * @example
 * const { showSuccess, showError } = useToast();
 * showSuccess('Note saved!');
 */
const useToast = () => {
  /**
   * Show success toast
   * @param {string} message - Success message
   */
  const showSuccess = (message) => {
    toast.success(message, {
      duration: 3000,
      position: 'bottom-right',
      style: {
        background: '#4CAF50',
        color: '#fff',
        fontFamily: 'Montserrat, sans-serif',
      },
      icon: '✅',
    });
  };

  /**
   * Show error toast
   * @param {string} message - Error message
   */
  const showError = (message) => {
    toast.error(message, {
      duration: 4000,
      position: 'bottom-right',
      style: {
        background: '#F44336',
        color: '#fff',
        fontFamily: 'Montserrat, sans-serif',
      },
      icon: '❌',
    });
  };

  /**
   * Show info toast
   * @param {string} message - Info message
   */
  const showInfo = (message) => {
    toast(message, {
      duration: 3000,
      position: 'bottom-right',
      style: {
        background: '#2196F3',
        color: '#fff',
        fontFamily: 'Montserrat, sans-serif',
      },
      icon: 'ℹ️',
    });
  };

  /**
   * Show warning toast
   * @param {string} message - Warning message
   */
  const showWarning = (message) => {
    toast(message, {
      duration: 3000,
      position: 'bottom-right',
      style: {
        background: '#FF9800',
        color: '#fff',
        fontFamily: 'Montserrat, sans-serif',
      },
      icon: '⚠️',
    });
  };

  /**
   * Show loading toast
   * @param {string} message - Loading message
   * @returns {string} Toast ID for dismissing
   */
  const showLoading = (message) => {
    return toast.loading(message, {
      position: 'bottom-right',
      style: {
        background: '#666',
        color: '#fff',
        fontFamily: 'Montserrat, sans-serif',
      },
    });
  };

  /**
   * Dismiss a specific toast
   * @param {string} toastId - ID of toast to dismiss
   */
  const dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  /**
   * Dismiss all toasts
   */
  const dismissAll = () => {
    toast.dismiss();
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    dismiss,
    dismissAll,
  };
};

export default useToast;