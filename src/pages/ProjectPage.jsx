import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ProjectDetailModal from '../components/Card/ProjectDetailModal';
import styles from './ProjectPage.module.css';

const ProjectPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await api.get(`/portfolio/${id}`);
        setItem(data);
      } catch (err) {
        setError('Project not found');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className={styles.page}>
        <div className={styles.errorBox}>
          <h2>Project not found</h2>
          <Link to="/" className={styles.backLink}>Go back to portfolio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backBtn}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back to Portfolio
      </Link>
      <ProjectDetailModal item={item} isOpen={true} onClose={() => {}} />
    </div>
  );
};

export default ProjectPage;
