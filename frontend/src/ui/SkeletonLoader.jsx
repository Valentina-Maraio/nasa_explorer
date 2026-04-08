import { memo } from 'react';
import styles from './styles/SkeletonLoader.module.css';

export const SkeletonLoader = memo(function SkeletonLoader({
  count = 1,
  height = 200,
  className = '',
}) {
  return (
    <div className={`${styles.loader} ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={styles.line}
          style={{ '--skeleton-height': `${height}px` }}
        />
      ))}
    </div>
  );
});

export default SkeletonLoader;
