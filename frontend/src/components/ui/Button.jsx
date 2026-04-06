import { memo } from 'react';
import styles from './styles/Button.module.css';

export const Button = memo(function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  style = {},
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn ${styles.button} ${className}`}
      style={style}
    >
      {loading ? '▸ PROCESSING...' : children}
    </button>
  );
});

export default Button;