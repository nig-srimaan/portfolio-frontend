import { motion } from 'framer-motion';
import styles from './NavBar.module.css';

const tabs = ['All', 'Projects', 'Internships', 'Certifications'];

const NavBar = ({ activeTab, onTabChange, counts }) => {
  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
              onClick={() => onTabChange(tab)}
            >
              <span>{tab}</span>
              {counts?.[tab] !== undefined && (
                <span className={styles.count}>{counts[tab]}</span>
              )}
              {activeTab === tab && (
                <motion.div
                  className={styles.indicator}
                  layoutId="tabIndicator"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
        <div className={styles.sortRow}>
          <span className={styles.sortLabel}>Sort by</span>
          <span className={styles.sortValue}>Latest</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
