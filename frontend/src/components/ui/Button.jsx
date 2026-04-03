export function Button({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false, 
  loading = false,
  className = '',
  style = {}
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn ${className}`}
      style={{
        width: '100%',
        opacity: disabled || loading ? 0.6 : 1,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        ...style
      }}
    >
      {loading ? '▸ PROCESSING...' : children}
    </button>
  );
}

export default Button;
