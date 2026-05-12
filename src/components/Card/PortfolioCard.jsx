import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './PortfolioCard.module.css';

const categoryColors = {
  Projects: { bg: 'rgba(124, 58, 237, 0.12)', border: 'rgba(124, 58, 237, 0.3)', text: '#a78bfa' },
  Internships: { bg: 'rgba(0, 229, 255, 0.08)', border: 'rgba(0, 229, 255, 0.2)', text: '#00e5ff' },
  Certifications: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.25)', text: '#f59e0b' },
};

const thumbnailGradients = [
  'linear-gradient(135deg, #0f1521 0%, #1a1040 50%, #0a1628 100%)',
  'linear-gradient(135deg, #0f1521 0%, #001a2e 50%, #0d1117 100%)',
  'linear-gradient(135deg, #1a0a0a 0%, #2d1b1b 50%, #0f0a1a 100%)',
  'linear-gradient(135deg, #0a1a0a 0%, #0d2d1b 50%, #0a0f12 100%)',
];

const PortfolioCard = ({ item, onLike, onDelete, isAdmin, index }) => {
  const [liked, setLiked] = useState(false);
  const [showLearned, setShowLearned] = useState(false);

  const colors = categoryColors[item.category] || categoryColors.Projects;
  const gradient = thumbnailGradients[index % thumbnailGradients.length];

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      onLike(item._id);
    }
  };

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      layout
    >
      <div className={styles.thumbnail} style={{ background: gradient }}>
        {item.thumbnailUrl ? (
          <img src={item.thumbnailUrl} alt={item.title} className={styles.thumbImg} />
        ) : (
          <div className={styles.thumbPlaceholder}>
            <div className={styles.thumbGrid} />
            <span className={styles.thumbInitial}>{item.title.charAt(0)}</span>
          </div>
        )}
        <div className={styles.categoryBadge} style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}>
          {item.category}
        </div>
        {item.featured && (
          <div className={styles.featuredBadge}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Featured
          </div>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.description}>{item.description}</p>

        <div className={styles.skills}>
          {item.skills.slice(0, 4).map((skill) => (
            <span key={skill} className={styles.skillTag}>{skill}</span>
          ))}
          {item.skills.length > 4 && (
            <span className={styles.skillMore}>+{item.skills.length - 4}</span>
          )}
        </div>

        {showLearned && (
          <motion.div
            className={styles.learned}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p className={styles.learnedLabel}>What I Learned</p>
            <p className={styles.learnedText}>{item.whatILearned}</p>
          </motion.div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <button
            className={`${styles.engageBtn} ${liked ? styles.liked : ''}`}
            onClick={handleLike}
            aria-label="Like"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>{item.likes}</span>
          </button>

          <button
            className={styles.engageBtn}
            onClick={() => setShowLearned(!showLearned)}
            aria-label="What I Learned"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{item.comments}</span>
          </button>

          {item.githubLink && (
            <a href={item.githubLink} target="_blank" rel="noopener noreferrer" className={styles.engageBtn}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          )}
          {item.externalLink && (
            <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className={styles.engageBtn}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          )}
        </div>

        {isAdmin && (
          <button
            className={styles.deleteBtn}
            onClick={() => onDelete(item._id)}
            aria-label="Delete item"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        )}
      </div>
    </motion.article>
  );
};

export default PortfolioCard;
