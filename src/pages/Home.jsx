import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from '../components/Header/Header';
import NavBar from '../components/NavBar/NavBar';
import PortfolioGrid from '../components/Card/PortfolioGrid';
import MessageModal from '../components/UI/MessageModal';
import usePortfolio from '../hooks/usePortfolio';
import { useAuth } from '../hooks/useAuth';
import styles from './Home.module.css';

const Home = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [messageOpen, setMessageOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { items, loading, error, likeItem, deleteItem, refetch } = usePortfolio(activeTab, search);

  const counts = useMemo(() => {
    const base = { All: items.length };
    ['Projects', 'Internships', 'Certifications'].forEach((cat) => {
      base[cat] = items.filter((i) => i.category === cat).length;
    });
    return base;
  }, [items]);

  return (
    <div className={styles.page}>
      <Toaster position="top-right" toastOptions={{ style: { background: '#0f1521', color: '#e8edf5', border: '1px solid rgba(255,255,255,0.08)' } }} />
      <Header onSearch={setSearch} onMessageClick={() => setMessageOpen(true)} />
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.toolbar}>
            <p className={styles.resultCount}>
              {loading ? 'Loading...' : `${items.length} item${items.length !== 1 ? 's' : ''}`}
            </p>
            <div className={styles.adminArea}>
              {isAuthenticated ? (
                <div className={styles.adminControls}>
                  <Link to="/admin" className={styles.adminLink}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Item
                  </Link>
                  <button className={styles.logoutBtn} onClick={logout}>Logout</button>
                </div>
              ) : (
                <Link to="/admin/login" className={styles.adminLoginLink}>Admin</Link>
              )}
            </div>
          </div>

          <PortfolioGrid
            items={items}
            loading={loading}
            error={error}
            onLike={likeItem}
            onDelete={deleteItem}
            isAdmin={isAuthenticated}
            search={search}
            category={activeTab}
          />
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© 2025 K. Srimaan Kameshwar · Built with React & Node.js</p>
      </footer>

      <MessageModal isOpen={messageOpen} onClose={() => setMessageOpen(false)} />
    </div>
  );
};

export default Home;
