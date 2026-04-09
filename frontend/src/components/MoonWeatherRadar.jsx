import { LoadingState } from '../ui/LoadingState';
import styles from './styles/MoonWeatherRadar.module.css';

function toDisplayTemp(value, units) {
  if (value == null || Number.isNaN(value)) {
    return null;
  }

  if (units === 'imperial') {
    return (value * (9 / 5)) + 32;
  }

  return value;
}

function formatMetric(value, digits = 2) {
  if (value == null || Number.isNaN(value)) {
    return '--';
  }

  return Number(value).toFixed(digits);
}

function normalizeSeries(values) {
  const numeric = values.filter((value) => value != null && Number.isFinite(value));
  if (numeric.length === 0) {
    return values.map(() => 0);
  }

  const min = Math.min(...numeric);
  const max = Math.max(...numeric);
  if (max === min) {
    return values.map((value) => (value == null ? 0 : 0.65));
  }

  return values.map((value) => {
    if (value == null || !Number.isFinite(value)) {
      return 0;
    }

    return 0.2 + (((value - min) / (max - min)) * 0.8);
  });
}

function buildPolygon(normalizedValues, radius, centerX, centerY) {
  const count = normalizedValues.length;
  if (count === 0) {
    return '';
  }

  return normalizedValues
    .map((value, index) => {
      const angle = (-Math.PI / 2) + ((2 * Math.PI * index) / count);
      const x = centerX + (Math.cos(angle) * radius * value);
      const y = centerY + (Math.sin(angle) * radius * value);
      return `${x},${y}`;
    })
    .join(' ');
}

function formatAxisLabel(dateValue) {
  if (!dateValue) {
    return '--';
  }

  const date = new Date(`${dateValue}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${month}/${day}`;
}

function MoonWeatherRadar({ history = [], units, loading, error, fromFallback, onRetry }) {
  const points = history.slice(0, 7).reverse();

  if (loading && points.length === 0) {
    return (
      <div className={styles.graphCard}>
        <div className={styles.graphHeading}>MOON RADAR</div>
        <LoadingState message="▸ BUILDING LUNAR RADAR..." minHeight="170px" />
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className={styles.graphCard}>
        <div className={styles.graphHeading}>MOON RADAR</div>
        <div className={styles.unavailable}>NO LUNAR HISTORY AVAILABLE</div>
        <button className={styles.retryButton} type="button" onClick={onRetry}>RETRY LUNAR TELEMETRY</button>
      </div>
    );
  }

  const tempSeries = points.map((item) => toDisplayTemp(item.proxyTempC, units));
  const lunarSeries = points.map((item) => item.lunarDistanceAu);
  const solarSeries = points.map((item) => item.sunDistanceAu);

  const normalizedTemp = normalizeSeries(tempSeries);
  const normalizedLunar = normalizeSeries(lunarSeries);
  const normalizedSolar = normalizeSeries(solarSeries);

  const size = 250;
  const center = 125;
  const radius = 78;
  const levels = [0.25, 0.5, 0.75, 1];

  const tempPolygon = buildPolygon(normalizedTemp, radius, center, center);
  const lunarPolygon = buildPolygon(normalizedLunar, radius, center, center);

  return (
    <div className={styles.graphCard}>
      <div className={styles.graphHeader}>
        <div className={styles.graphHeading}>MOON RADAR</div>
        <span className={styles.graphMode}>{units === 'imperial' ? 'F / AU' : 'C / AU'}</span>
      </div>

      <div className={styles.graphWrap}>
        <svg viewBox={`0 0 ${size} ${size}`} className={styles.radarSvg} role="img" aria-label="Moon weather radar graph">
          {levels.map((level) => (
            <polygon
              key={level}
              points={buildPolygon(points.map(() => level), radius, center, center)}
              className={styles.gridPolygon}
            />
          ))}

          {points.map((point, index) => {
            const angle = (-Math.PI / 2) + ((2 * Math.PI * index) / points.length);
            const x = center + (Math.cos(angle) * radius);
            const y = center + (Math.sin(angle) * radius);
            const labelX = center + (Math.cos(angle) * (radius + 18));
            const labelY = center + (Math.sin(angle) * (radius + 18));

            return (
              <g key={`${point.date || point.timestamp || 'point'}-${index}`}>
                <line x1={center} y1={center} x2={x} y2={y} className={styles.axisLine} />
                <text x={labelX} y={labelY} className={styles.axisLabel} textAnchor="middle">
                  {formatAxisLabel(point.date)}
                </text>
              </g>
            );
          })}

          <polygon points={tempPolygon} className={styles.tempPolygon} />
          <polygon points={lunarPolygon} className={styles.lunarPolygon} />
          <circle cx={center} cy={center} r="2.8" className={styles.centerDot} />
        </svg>
      </div>

      <div className={styles.legend}>
        <span><i className={styles.legendTemp} />PROXY TEMP</span>
        <span><i className={styles.legendLunar} />LUNAR DIST</span>
      </div>

      <div className={styles.metricsRow}>
        <div>NOW TEMP {formatMetric(tempSeries[tempSeries.length - 1], 1)} {units === 'imperial' ? 'F' : 'C'}</div>
      </div>

      {fromFallback ? <div className={styles.fallbackTag}>FALLBACK CACHE ACTIVE</div> : null}
      {error ? <div className={styles.errorLine}>LUNAR LINK DEGRADED · <button className={styles.inlineRetry} type="button" onClick={onRetry}>RETRY</button></div> : null}
    </div>
  );
}

export default MoonWeatherRadar;
