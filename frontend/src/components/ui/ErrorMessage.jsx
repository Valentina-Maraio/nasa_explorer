export function ErrorMessage({ 
  message = 'An error occurred', 
  onRetry = null,
  className = ''
}) {
  return (
    <div 
      className={`error ${className}`}
      style={{
        padding: '15px',
        marginBottom: '20px',
        background: 'rgba(255, 0, 0, 0.1)',
        border: '1px solid rgba(255, 0, 0, 0.3)',
        borderRadius: '2px',
        color: '#ff6b6b',
      }}
    >
      <div style={{ marginBottom: onRetry ? '10px' : 0 }}>
        ✗ ERROR: {message}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '8px 12px',
            background: 'rgba(255, 100, 100, 0.2)',
            border: '1px solid rgba(255, 100, 100, 0.5)',
            color: '#ff6b6b',
            cursor: 'pointer',
            borderRadius: '2px',
            fontSize: '0.9rem',
          }}
        >
          ▶ RETRY
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;