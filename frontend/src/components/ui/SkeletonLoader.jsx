export function SkeletonLoader({ 
  count = 1, 
  height = 200,
  className = ''
}) {
  return (
    <div className={`skeleton-loader ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            height: `${height}px`,
            background: 'linear-gradient(90deg, rgba(0,255,159,0.1) 25%, rgba(0,255,159,0.2) 50%, rgba(0,255,159,0.1) 75%)',
            backgroundSize: '200% 100%',
            animation: 'skeleton-loading 1.5s infinite',
            marginBottom: '15px',
            borderRadius: '2px',
          }}
        />
      ))}
      <style>{`
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export default SkeletonLoader;
