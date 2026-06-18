import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import UploadForm from '../components/Admin/UploadForm';
import ProfileEditor from '../components/Admin/ProfileEditor';
import EditItemModal from '../components/Admin/EditItemModal';
import usePortfolio from '../hooks/usePortfolio';
import useProfile from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import styles from './AdminDashboard.module.css';

const StatCard = ({ label, value, color }) => (
  <div className={styles.statCard} style={{ '--accent': color }}>
    <span className={styles.statValue}>{value}</span>
    <span className={styles.statLabel}>{label}</span>
  </div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [editItem, setEditItem] = useState(null);
  const { logout } = useAuth();
  const { items, loading, refetch, deleteItem } = usePortfolio();
  const { profile, updateProfile } = useProfile();

  const stats = {
    total: items.length,
    projects: items.filter((i) => i.category === 'Projects').length,
    internships: items.filter((i) => i.category === 'Internships').length,
    certifications: items.filter((i) => i.category === 'Certifications').length,
  };

  return (
    <div className={styles.page}>
      <Toaster position="top-right" toastOptions={{ style: { background: '#0f1521', color: '#e8edf5', border: '1px solid rgba(255,255,255,0.08)' } }} />

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <Link to="/" className={styles.backBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </Link>
            <div>
              <h1 className={styles.pageTitle}>Admin Dashboard</h1>
              <p className={styles.pageSubtitle}>Manage your portfolio content</p>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={logout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.stats}>
            <StatCard label="Total Items" value={stats.total} color="var(--accent-cyan)" />
            <StatCard label="Projects" value={stats.projects} color="#a78bfa" />
            <StatCard label="Internships" value={stats.internships} color="var(--accent-cyan)" />
            <StatCard label="Certifications" value={stats.certifications} color="var(--accent-amber)" />
          </div>

          <div className={styles.tabBar}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'upload' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Portfolio Item
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'profile' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              Edit Profile
            </button>
          </div>

          <div className={styles.layout}>
            <div className={styles.formCol}>
              {activeTab === 'upload' && <UploadForm onSuccess={refetch} />}
              {activeTab === 'profile' && <ProfileEditor profile={profile} onUpdate={updateProfile} />}
            </div>

            <div className={styles.listCol}>
              <div className={styles.listHeader}>
                <h2 className={styles.listTitle}>Existing Items</h2>
                <span className={styles.listCount}>{items.length}</span>
              </div>
              {loading ? (
                <div className={styles.listLoading}>Loading...</div>
              ) : items.length === 0 ? (
                <div className={styles.listEmpty}>No items yet. Add your first portfolio item.</div>
              ) : (
                <div className={styles.list}>
                  {items.map((item, i) => (
                    <motion.div
                      key={item._id}
                      className={styles.listItem}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <div className={styles.listItemLeft}>
                        <div className={styles.listThumb}>
                          {item.thumbnailUrl ? (
                            <img src={item.thumbnailUrl} alt="" />
                          ) : (
                            <span>{item.title.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className={styles.listItemTitle}>{item.title}</p>
                          <p className={styles.listItemCat}>{item.category}</p>
                        </div>
                      </div>
                      <div className={styles.listItemActions}>
                        <button
                          className={styles.editBtn}
                          onClick={() => setEditItem(item)}
                          aria-label="Edit"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          className={styles.listDeleteBtn}
                          onClick={() => deleteItem(item._id)}
                          aria-label="Delete"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <EditItemModal
        item={editItem}
        isOpen={!!editItem}
        onClose={() => setEditItem(null)}
        onSuccess={refetch}
      />
    </div>
  );
};

export default AdminDashboard;
