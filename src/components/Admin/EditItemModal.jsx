import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import styles from './EditItemModal.module.css';

const categories = ['Projects', 'Internships', 'Certifications'];

const EditItemModal = ({ item, isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Projects',
    skills: '',
    whatILearned: '',
    externalLink: '',
    githubLink: '',
    featured: false,
    currentlyWorking: false,
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [newMedia, setNewMedia] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);
  const [saving, setSaving] = useState(false);
  const thumbRef = useRef();
  const mediaRef = useRef();

  useEffect(() => {
    if (item) {
      setForm({
        title: item.title || '',
        description: item.description || '',
        category: item.category || 'Projects',
        skills: item.skills?.join(', ') || '',
        whatILearned: item.whatILearned || '',
        externalLink: item.externalLink || '',
        githubLink: item.githubLink || '',
        featured: item.featured || false,
        currentlyWorking: item.currentlyWorking || false,
      });
      setThumbPreview(item.thumbnailUrl || null);
      setExistingMedia(item.mediaUrls || []);
      setThumbnail(null);
      setNewMedia([]);
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleThumb = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbPreview(URL.createObjectURL(file));
    }
  };

  const handleNewMedia = (e) => {
    setNewMedia(Array.from(e.target.files));
  };

  const removeExistingMedia = async (url) => {
    const updated = existingMedia.filter((m) => m !== url);
    setExistingMedia(updated);
    try {
      await api.patch(`/portfolio/${item._id}/media`, { mediaUrls: updated });
      toast.success('File removed');
    } catch {
      toast.error('Failed to remove file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      const skillsArray = form.skills ? form.skills.split(',').map((s) => s.trim()).filter(Boolean) : [];
      fd.set('skills', JSON.stringify(skillsArray));
      if (thumbnail) fd.append('thumbnail', thumbnail);
      newMedia.forEach((f) => fd.append('media', f));
      await api.put(`/portfolio/${item._id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Item updated!');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

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
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Edit Item</h2>
              <button className={styles.closeBtn} onClick={onClose}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.thumbUpload} onClick={() => thumbRef.current.click()}>
                {thumbPreview ? (
                  <img src={thumbPreview} alt="Thumbnail" className={styles.thumbPreview} />
                ) : (
                  <div className={styles.thumbEmpty}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>Click to change thumbnail</span>
                  </div>
                )}
                <input ref={thumbRef} type="file" accept="image/*" onChange={handleThumb} style={{ display: 'none' }} />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Title</label>
                  <input name="title" value={form.title} onChange={handleChange} className={styles.input} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className={styles.input}>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {form.category === 'Internships' && (
                <div className={styles.field}>
                  <label className={styles.label}>Currently Working Here?</label>
                  <div className={styles.toggleRow}>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${form.currentlyWorking ? styles.toggleActive : ''}`}
                      onClick={() => setForm((p) => ({ ...p, currentlyWorking: true }))}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggleBtn} ${!form.currentlyWorking ? styles.toggleActive : ''}`}
                      onClick={() => setForm((p) => ({ ...p, currentlyWorking: false }))}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}

              <div className={styles.field}>
                <label className={styles.label}>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} className={styles.textarea} rows={3} />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Skills Used</label>
                <input name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js (comma separated)" className={styles.input} />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>What I Learned</label>
                <textarea name="whatILearned" value={form.whatILearned} onChange={handleChange} className={styles.textarea} rows={3} />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>GitHub Link</label>
                  <input name="githubLink" value={form.githubLink} onChange={handleChange} className={styles.input} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>External Link</label>
                  <input name="externalLink" value={form.externalLink} onChange={handleChange} className={styles.input} />
                </div>
              </div>

              {existingMedia.length > 0 && (
                <div className={styles.field}>
                  <label className={styles.label}>Existing Files</label>
                  <div className={styles.existingFiles}>
                    {existingMedia.map((entry, i) => {
                      const [url, originalName] = entry.includes('||') ? entry.split('||') : [entry, entry.split('/').pop()];
                      const ext = url.split('.').pop().split('?')[0].toUpperCase();
                      return (
                        <div key={i} className={styles.existingFile}>
                          <div className={styles.existingFileIcon}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                          <span className={styles.existingFileName}>{originalName}</span>
                          <span className={styles.existingFileExt}>{ext}</span>
                          <button
                            type="button"
                            className={styles.removeFileBtn}
                            onClick={() => removeExistingMedia(entry)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className={styles.mediaUpload} onClick={() => mediaRef.current.click()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>{newMedia.length > 0 ? `${newMedia.length} new file(s) selected` : 'Upload additional files'}</span>
                <input ref={mediaRef} type="file" multiple onChange={handleNewMedia} style={{ display: 'none' }} />
              </div>

              <label className={styles.checkRow}>
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className={styles.checkbox} />
                <span className={styles.checkLabel}>Mark as Featured</span>
              </label>

              <button type="submit" className={styles.saveBtn} disabled={saving}>
                {saving ? <span className={styles.spinner} /> : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditItemModal;
