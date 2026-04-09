import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
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

function RiskIndexChart({ series }) {
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <span className={styles.chartLabel}>COMPOSITE RISK INDEX</span>
        <span className={styles.chartSub}>
          Derived daily threat score (0–100) — hazard ratio × velocity × proximity
        </span>
      </div>
      <div className={styles.chartBody}>
        <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(216,220,226,0.08)" />
          <XAxis dataKey="date" tick={TICK_STYLE} />
          <YAxis
            domain={[0, 100]}
            tick={TICK_STYLE}
            label={{
              value: 'RISK',
              angle: -90,
              position: 'insideLeft',
              fill: 'rgba(216,220,226,0.35)',
              fontSize: 9,
              fontFamily: 'Courier New',
            }}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <ReferenceLine
            y={50}
            stroke="rgba(255,179,71,0.4)"
            strokeDasharray="4 4"
            label={{
              value: 'CAUTION',
              fill: 'rgba(255,179,71,0.45)',
              fontSize: 9,
              fontFamily: 'Courier New',
              position: 'insideTopRight',
            }}
          />
          <Line
            type="monotone"
            dataKey="risk"
            name="Risk Index"
            stroke="#ff6173"
            strokeWidth={2}
            dot={{ fill: '#ff6173', r: 3 }}
            activeDot={{ r: 5, fill: '#ffb347' }}
          />
        </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RiskIndexChart;
