import { motion, AnimatePresence } from 'framer-motion';
import PortfolioCard from '../Card/PortfolioCard';
import styles from './PortfolioGrid.module.css';

const SkeletonCard = () => (
  <div className={styles.skeleton}>
    <div className={styles.skelThumb} />
    <div className={styles.skelBody}>
      <div className={styles.skelLine} style={{ width: '70%', height: '16px' }} />
      <div className={styles.skelLine} style={{ width: '100%', height: '12px' }} />
      <div className={styles.skelLine} style={{ width: '85%', height: '12px' }} />
      <div className={styles.skelTags}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.skelTag} />
        ))}
      </div>
    </div>
  </div>
);

const EmptyState = ({ search, category }) => (
  <motion.div
    className={styles.empty}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className={styles.emptyIcon}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </div>
    <h3 className={styles.emptyTitle}>Nothing here yet</h3>
    <p className={styles.emptySubtitle}>
      {search
        ? `No results for "${search}" — try a different search term.`
        : `No ${category !== 'All' ? category.toLowerCase() : 'portfolio items'} have been added yet.`}
    </p>
  </motion.div>
);

const PortfolioGrid = ({ items, loading, error, onLike, onDelete, isAdmin, search, category }) => {
  if (error) {
    return (
      <div className={styles.error}>
        <span>{error}</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return <EmptyState search={search} category={category} />;
  }

  return (
    <motion.div className={styles.grid} layout>
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <PortfolioCard
            key={item._id}
            item={item}
            index={index}
            onLike={onLike}
            onDelete={onDelete}
            isAdmin={isAdmin}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default PortfolioGrid;
