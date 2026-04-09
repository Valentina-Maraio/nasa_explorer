import SolarFlarePanel from './SolarFlarePanel';
import styles from './styles/SolarPage.module.css';

function SolarPage({ solarFlares }) {
  return (
    <div className={`dashboard-panel ${styles.solarPage}`}>
      <SolarFlarePanel
        data={solarFlares?.data}
        loading={solarFlares?.loading}
        error={solarFlares?.error}
        fromFallback={solarFlares?.fromFallback}
        retry={solarFlares?.retry}
      />
    </div>
  );
}

export default SolarPage;
