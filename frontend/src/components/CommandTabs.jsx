import styles from './styles/CommandTabs.module.css';

function CommandTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className={styles.tabStrip} role="tablist" aria-label="Command views">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === activeTab}
          className={`${styles.tabButton} ${tab.id === activeTab ? styles.tabButtonActive : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default CommandTabs;
