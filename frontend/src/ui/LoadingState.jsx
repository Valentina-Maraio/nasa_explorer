import { memo } from 'react';
import styles from './styles/LoadingState.module.css';

export const LoadingState = memo(function LoadingState({
  message = '▸ LOADING...',
  minHeight = '200px',
  className = '',
}) {
  return (
    <div
      className={`loading ${styles.loading} ${className}`}
      style={{ '--loading-min-height': minHeight }}
    >
      {message}
    </div>
  );
});

export default LoadingState;
