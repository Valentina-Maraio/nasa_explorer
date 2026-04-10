import { memo } from 'react';
import rocketLoaderVideo from '../assets/rocket_loader.mp4';
import styles from './styles/RocketLoader.module.css';

export const RocketLoader = memo(function RocketLoader({
  visible,
  className = '',
}) {
  if (!visible) {
    return null;
  }

  return (
    <div className={`${styles.overlay} ${className}`} role="status" aria-live="polite" aria-label="Application loading">
      <video
        className={styles.video}
        src={rocketLoaderVideo}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    </div>
  );
});

export default RocketLoader;
