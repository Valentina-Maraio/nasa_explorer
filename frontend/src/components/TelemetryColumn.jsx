import styles from './styles/TelemetryColumn.module.css';

function TelemetryColumn() {
  return (
    <aside className={styles.leftColumn}>
      <section className="dashboard-panel">
        <div className={styles.panelHeading}>02 RESERVES</div>
        <div className={styles.telemetryMetaGrid}>
          <div>
            <span>STATUS</span>
            <strong>ONLINE</strong>
          </div>
        </div>
      </section>
    </aside>
  );
}

export default TelemetryColumn;
