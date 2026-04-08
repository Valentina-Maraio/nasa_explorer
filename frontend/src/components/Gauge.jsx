import styles from './styles/Gauge.module.css';

function Gauge({ value }) {
  const clamped = Math.max(0, Math.min(100, value));
  const angle = (clamped / 100) * 283;

  return (
    <div className={styles.gaugeWrap}>
      <svg viewBox="0 0 120 120" className={styles.gauge} aria-hidden="true">
        <circle cx="60" cy="60" r="45" className={styles.gaugeTrack} />
        <circle
          cx="60"
          cy="60"
          r="45"
          className={styles.gaugeValue}
          style={{ strokeDasharray: `${angle} 283` }}
        />
      </svg>
      <div className={styles.gaugeLabel}>
        <strong>{clamped}%</strong>
        <span>{clamped >= 50 ? 'CRITICAL' : clamped >= 25 ? 'ELEVATED' : 'LOW'}</span>
      </div>
    </div>
  );
}

export default Gauge;
