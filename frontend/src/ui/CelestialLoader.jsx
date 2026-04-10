import { memo } from 'react';
import sunSvg from '../assets/sun.svg';
import moonSvg from '../assets/moon.svg';
import marsSvg from '../assets/mars.svg';
import satelliteSvg from '../assets/satellite.svg';
import radarSvg from '../assets/radar.svg';
import styles from './styles/CelestialLoader.module.css';

const ICONS = {
  sun: sunSvg,
  moon: moonSvg,
  mars: marsSvg,
  satellite: satelliteSvg,
  radar: radarSvg,
};

const SIZE_CLASS = {
  small: 'sizeSmall',
  medium: 'sizeMedium',
  large: 'sizeLarge',
};

export const CelestialLoader = memo(function CelestialLoader({
  kind = 'moon',
  message = '▸ LOADING...',
  minHeight = '200px',
  size = 'medium',
  className = '',
}) {
  const iconSrc = ICONS[kind] || ICONS.moon;
  const sizeClass = SIZE_CLASS[size] || SIZE_CLASS.medium;

  return (
    <div
      className={`loading ${styles.loader} ${className}`}
      style={{ '--loading-min-height': minHeight }}
    >
      <div className={`${styles.iconFrame} ${styles[sizeClass]}`}>
        <img className={styles.icon} src={iconSrc} alt="" aria-hidden="true" />
      </div>
      <div className={styles.message}>{message}</div>
    </div>
  );
});

export default CelestialLoader;
