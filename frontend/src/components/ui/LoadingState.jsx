export function LoadingState({ 
  message = '▸ LOADING...', 
  minHeight = '200px',
  className = ''
}) {
  return (
    <div
      className={`loading ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight,
        color: 'rgba(0, 255, 159, 0.7)',
        fontSize: '1rem',
        fontStyle: 'italic',
      }}
    >
      {message}
    </div>
  );
}

export default LoadingState;