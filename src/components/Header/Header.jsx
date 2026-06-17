import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Header.module.css';

const SearchBar = ({ onSearch, onClose }) => {
  const [value, setValue] = useState('');
  const handleChange = (e) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };
  return (
    <motion.div
      className={styles.searchOverlay}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <input
        autoFocus
        type="text"
        placeholder="Search projects, skills, technologies..."
        value={value}
        onChange={handleChange}
        className={styles.searchInput}
      />
      <button onClick={onClose} className={styles.searchClose}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </motion.div>
  );
};

const Header = ({ profile, onSearch, onMessageClick }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  const handleClose = () => {
    setSearchOpen(false);
    onSearch('');
  };

  const initials = profile?.name
    ? profile.name.split(' ').map((w) => w[0]).join('').slice(0, 3).toUpperCase()
    : '...';

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.profileSection}>
          <motion.div
            className={styles.avatarWrapper}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className={styles.avatarRing} />
            <div className={styles.avatar}>
              {profile?.avatarUrl ? (
                <img src={`https://portfolio-backend-fhv2.onrender.com${profile.avatarUrl}`} alt={profile.name} className={styles.avatarImg} />
              ) : (
                <span className={styles.avatarInitials}>{initials}</span>
              )}
            </div>
            <div className={styles.statusDot} />
          </motion.div>

          <motion.div
            className={styles.profileInfo}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className={styles.name}>{profile?.name || 'Loading...'}</h1>
            {profile?.subtitle && (
              <p className={styles.subtitle}>{profile.subtitle}</p>
            )}
            {profile?.domains?.length > 0 && (
              <div className={styles.domains}>
                {profile.domains.map((d, i) => (
                  <motion.span
                    key={d}
                    className={styles.domainTag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                  >
                    {d}
                  </motion.span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          className={styles.headerActions}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button className={styles.iconBtn} onClick={() => setSearchOpen(true)} aria-label="Search">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button className={styles.messageBtn} onClick={onMessageClick}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Message</span>
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {searchOpen && <SearchBar onSearch={onSearch} onClose={handleClose} />}
      </AnimatePresence>
    </header>
  );
};

export default Header;
