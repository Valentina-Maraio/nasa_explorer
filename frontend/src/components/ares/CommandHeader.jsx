import styles from '../../style/ares/CommandHeader.module.css';
import CommandTabs from './CommandTabs';

function CommandHeader({ tabs, activeTab, onTabChange }) {
  return (
    <div className={styles.topBar}>
      <div className={styles.topBarMain}>
        <div className={styles.titleRow}>
          <h2 className={`panel-title ${styles.pageTitle}`}>ARES COMMAND V2.4</h2>
          <CommandTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
          <div className={styles.nominalBadge}>● SYSTEM NOMINAL</div>
        </div>
      </div>
    </div>
  );
}

export default CommandHeader;
