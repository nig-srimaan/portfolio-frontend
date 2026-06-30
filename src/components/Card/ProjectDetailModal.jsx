import { motion, AnimatePresence } from 'framer-motion';
import styles from './ProjectDetailModal.module.css';

const categoryColors = {
  Projects: { bg: 'rgba(124, 58, 237, 0.12)', border: 'rgba(124, 58, 237, 0.3)', text: '#a78bfa' },
  Internships: { bg: 'rgba(0, 229, 255, 0.08)', border: 'rgba(0, 229, 255, 0.2)', text: '#00e5ff' },
  Certifications: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.25)', text: '#f59e0b' },
};

const ProjectDetailModal = ({ item, isOpen, onClose }) => {
  if (!item) return null;
  const colors = categoryColors[item.category] || categoryColors.Projects;

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
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            style={{ x: '-50%', y: '-50%' }}
          >
            <button className={styles.closeBtn} onClick={onClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {item.thumbnailUrl && (
              <div className={styles.heroImage}>
                <img src={item.thumbnailUrl} alt={item.title || 'Project'} />
              </div>
            )}

            <div className={styles.body}>
              <div className={styles.topRow}>
                <span
                  className={styles.categoryBadge}
                  style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}
                >
                  {item.category}
                </span>
                {item.featured && (
                  <span className={styles.featuredBadge}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Featured
                  </span>
                )}
                {item.category === 'Internships' && item.currentlyWorking && (
                  <span className={styles.workingBadge}>
                    <span className={styles.workingDot} />
                    Currently Working
                  </span>
                )}
              </div>

              {item.title && <h2 className={styles.title}>{item.title}</h2>}

              {item.description && (
                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>Overview</h3>
                  <p className={styles.sectionText}>{item.description}</p>
                </div>
              )}

              {item.skills?.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>Skills Used</h3>
                  <div className={styles.skills}>
                    {item.skills.map((skill) => (
                      <span key={skill} className={styles.skillTag}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {item.whatILearned && (
                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>What I Learned</h3>
                  <p className={styles.sectionText}>{item.whatILearned}</p>
                </div>
              )}

              {item.mediaUrls?.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionLabel}>Media & Files</h3>
                  <div className={styles.fileList}>
                    {item.mediaUrls.map((entry, i) => {
                      const [url, originalName] = entry.includes('||') ? entry.split('||') : [entry, entry.split('/').pop()];
                      const ext = url.split('.').pop().split('?')[0].toLowerCase();
                      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
                      const isPdf = ext === 'pdf';
                      const finalUrl = isPdf ? url : url.replace('/upload/', '/upload/fl_attachment/');
                      return (
                        <a key={i} href={finalUrl} target="_blank" rel="noreferrer" className={styles.fileRow}>
                          {isImage ? (
                            <div className={styles.fileRowThumb}>
                              <img src={url} alt={`Media ${i + 1}`} />
                            </div>
                          ) : (
                            <div className={styles.fileRowIcon}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg>
                            </div>
                          )}
                          <div className={styles.fileRowInfo}>
                            <span className={styles.fileRowName}>{originalName}</span>
                            <span className={styles.fileRowExt}>{ext.toUpperCase()}</span>
                          </div>
                          <div className={styles.fileRowDownload}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="7 10 12 15 17 10" />
                              <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {(item.githubLink || item.externalLink) && (
                <div className={styles.linksRow}>
                  {item.githubLink && (
                    <a href={item.githubLink} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                      View on GitHub
                    </a>
                  )}
                  {item.externalLink && (
                    <a href={item.externalLink} target="_blank" rel="noreferrer" className={styles.linkBtnPrimary}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      View Live
                    </a>
                  )}
                </div>
              )}

              <div className={styles.statsRow}>
                <span className={styles.statItem}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {item.likes} likes
                </span>
                <span className={styles.statItem}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {item.comments} comments
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetailModal;
