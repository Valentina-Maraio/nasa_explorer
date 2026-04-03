export function Card({ children, className = '' }) {
  return (
    <div className={`dashboard-panel ${className}`}>
      {children}
    </div>
  );
}

export default Card;
