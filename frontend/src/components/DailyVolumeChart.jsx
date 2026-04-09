import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
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

const LEGEND_STYLE = {
  fontSize: 10,
  fontFamily: 'Courier New',
  color: 'rgba(216,220,226,0.7)',
};

function DailyVolumeChart({ series }) {
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartHeader}>
        <span className={styles.chartLabel}>DAILY APPROACH VOLUME</span>
        <span className={styles.chartSub}>Total objects vs hazardous ratio per day</span>
      </div>
      <div className={styles.chartBody}>
        <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={series} margin={{ top: 8, right: 28, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(216, 226, 224, 0.08)" />
          <XAxis dataKey="date" tick={TICK_STYLE} />
          <YAxis
            yAxisId="left"
            tick={TICK_STYLE}
            label={{
              value: 'COUNT',
              angle: -90,
              position: 'insideLeft',
              fill: 'rgba(216,220,226,0.35)',
              fontSize: 9,
              fontFamily: 'Courier New',
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={TICK_STYLE}
            label={{
              value: 'HAZ %',
              angle: 90,
              position: 'insideRight',
              fill: 'rgba(216,220,226,0.35)',
              fontSize: 9,
              fontFamily: 'Courier New',
            }}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend wrapperStyle={LEGEND_STYLE} />
          <Bar
            yAxisId="left"
            dataKey="total"
            name="Total"
            fill="rgba(0,136,255,0.5)"
            stroke="rgba(0,136,255,0.85)"
          />
          <Bar
            yAxisId="left"
            dataKey="hazardous"
            name="Hazardous"
            fill="rgba(255,97,115,0.5)"
            stroke="rgba(255,97,115,0.85)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="hazardousRatio"
            name="Haz %"
            stroke="#ffb347"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DailyVolumeChart;
