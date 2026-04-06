import { memo } from 'react';
import styles from './styles/ErrorMessage.module.css';

export const ErrorMessage = memo(function ErrorMessage({
  message = 'An error occurred',
  onRetry = null,
  className = '',
}) {
  return (
    <div
      className={`error ${styles.errorBox} ${className}`}
    >
      <div className={onRetry ? styles.errorTextWithRetry : styles.errorText}>
        ✗ ERROR: {message}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className={styles.retryButton}
        >
          ▶ RETRY
        </button>
      )}
    </div>
  );
});

export default ErrorMessage;
