import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styles from './styles/NeoChart.module.css';

const TICK_STYLE = {
  fill: 'rgba(216,220,226,0.6)',
  fontSize: 10,
  fontFamily: 'Courier New',
};

const TOOLTIP_STYLE = {
  background: 'rgba(8,12,27,0.96)',
  border: '1px solid rgba(255,179,71,0.35)',
  color: '#d8dce2',
  fontFamily: 'Courier New',
  fontSize: 11,
};

const LEGEND_STYLE = {
  fontSize: 10,
  fontFamily: 'Courier New',
  color: 'rgba(216,220,226,0.7)',
};

function VelocityMissDistanceChart({ series }) {
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <span className={styles.chartLabel}>VELOCITY vs MISS DISTANCE</span>
        <span className={styles.chartSub}>Approach speed (km/s) vs closest distance (×10³ km) per object</span>
      </div>
      <div className={styles.chartBody}>
        <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(216,220,226,0.08)" />
          <XAxis
            type="number"
            dataKey="x"
            name="Velocity"
            unit=" km/s"
            tick={TICK_STYLE}
            label={{
              value: 'KM/S',
              position: 'insideBottom',
              fill: 'rgba(216,220,226,0.35)',
              fontSize: 9,
              fontFamily: 'Courier New',
              offset: -8,
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Miss Distance"
            unit="k"
            tick={TICK_STYLE}
            label={{
              value: '×10³ KM',
              angle: -90,
              position: 'insideLeft',
              fill: 'rgba(216,220,226,0.35)',
              fontSize: 9,
              fontFamily: 'Courier New',
            }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={TOOLTIP_STYLE}
          />
          <Legend wrapperStyle={LEGEND_STYLE} />
          <Scatter
            name="Non-Hazardous"
            data={series.safe}
            fill="rgba(0,255,255,0.7)"
            opacity={0.8}
          />
          <Scatter
            name="Hazardous"
            data={series.hazardous}
            fill="rgba(255,97,115,0.9)"
          />
        </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default VelocityMissDistanceChart;
