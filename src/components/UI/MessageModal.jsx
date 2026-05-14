import { motion, AnimatePresence } from 'framer-motion';
import styles from './MessageModal.module.css';

const MessageModal = ({ isOpen, onClose, profile }) => {
  const hasEmail = profile?.email;
  const hasLinkedin = profile?.linkedin;
  const hasGithub = profile?.github;
  const hasAny = hasEmail || hasLinkedin || hasGithub;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className={styles.header}>
              <h3 className={styles.title}>Get in Touch</h3>
              <button className={styles.close} onClick={onClose}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className={styles.content}>
              {!hasAny && (
                <p className={styles.empty}>No contact links added yet.</p>
              )}
              {hasEmail && (
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <p className={styles.contactLabel}>Email</p>
                    <a href={`mailto:${profile.email}`} className={styles.contactValue}>{profile.email}</a>
                  </div>
                </div>
              )}
              {hasLinkedin && (
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon} style={{ background: 'rgba(124, 58, 237, 0.1)', borderColor: 'rgba(124, 58, 237, 0.2)', color: '#a78bfa' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </div>
                  <div>
                    <p className={styles.contactLabel}>LinkedIn</p>
                    <a href={profile.linkedin} target="_blank" rel="noreferrer" className={styles.contactValue}>
                      {profile.linkedin.replace('https://', '')}
                    </a>
                  </div>
                </div>
              )}
              {hasGithub && (
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon} style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <div>
                    <p className={styles.contactLabel}>GitHub</p>
                    <a href={profile.github} target="_blank" rel="noreferrer" className={styles.contactValue}>
                      {profile.github.replace('https://', '')}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MessageModal;
