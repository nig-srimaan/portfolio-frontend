import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import styles from './UploadForm.module.css';

const categories = ['Projects', 'Internships', 'Certifications'];

const initialState = {
  title: '',
  description: '',
  category: 'Projects',
  skills: '',
  whatILearned: '',
  externalLink: '',
  githubLink: '',
  featured: false,
};

const UploadForm = ({ onSuccess }) => {
  const [form, setForm] = useState(initialState);
  const [thumbnail, setThumbnail] = useState(null);
  const [media, setMedia] = useState([]);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const thumbRef = useRef();
  const mediaRef = useRef();

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

  const handleMedia = (e) => {
    const files = Array.from(e.target.files);
    setMedia(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.skills || !form.whatILearned) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    const skillsArray = form.skills.split(',').map((s) => s.trim()).filter(Boolean);
    fd.set('skills', JSON.stringify(skillsArray));

    if (thumbnail) fd.append('thumbnail', thumbnail);
    media.forEach((f) => fd.append('media', f));

    try {
      await api.post('/portfolio', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Portfolio item added!');
      setForm(initialState);
      setThumbnail(null);
      setMedia([]);
      setThumbPreview(null);
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      className={styles.form}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Add Portfolio Item</h2>
        <p className={styles.formSubtitle}>Upload a new project, internship, or certification</p>
      </div>

      <div className={styles.thumbUpload} onClick={() => thumbRef.current.click()}>
        {thumbPreview ? (
          <img src={thumbPreview} alt="Thumbnail preview" className={styles.thumbPreview} />
        ) : (
          <div className={styles.thumbEmpty}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>Click to upload thumbnail</span>
          </div>
        )}
        <input ref={thumbRef} type="file" accept="image/*" onChange={handleThumb} style={{ display: 'none' }} />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Title <span className={styles.req}>*</span></label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Real-time Chat App"
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Category <span className={styles.req}>*</span></label>
          <select name="category" value={form.category} onChange={handleChange} className={styles.input}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description <span className={styles.req}>*</span></label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the project, its purpose, and key outcomes..."
          className={styles.textarea}
          rows={3}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Skills Used <span className={styles.req}>*</span></label>
        <input
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="React, Node.js, MongoDB (comma separated)"
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>What I Learned <span className={styles.req}>*</span></label>
        <textarea
          name="whatILearned"
          value={form.whatILearned}
          onChange={handleChange}
          placeholder="Key takeaways, new concepts mastered, challenges overcome..."
          className={styles.textarea}
          rows={4}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>GitHub Link</label>
          <input
            name="githubLink"
            value={form.githubLink}
            onChange={handleChange}
            placeholder="https://github.com/..."
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>External Link</label>
          <input
            name="externalLink"
            value={form.externalLink}
            onChange={handleChange}
            placeholder="https://..."
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.mediaUpload} onClick={() => mediaRef.current.click()}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span>{media.length > 0 ? `${media.length} file(s) selected` : 'Upload additional media files'}</span>
        <input ref={mediaRef} type="file" multiple onChange={handleMedia} style={{ display: 'none' }} />
      </div>

      <label className={styles.checkRow}>
        <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className={styles.checkbox} />
        <span className={styles.checkLabel}>Mark as Featured</span>
      </label>

      <button type="submit" className={styles.submitBtn} disabled={submitting}>
        {submitting ? (
          <span className={styles.spinner} />
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add to Portfolio
          </>
        )}
      </button>
    </motion.form>
  );
};

export default UploadForm;
