import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import styles from './ProfileEditor.module.css';

const ProfileEditor = ({ profile, onUpdate }) => {
  const [form, setForm] = useState({
    name: '',
    subtitle: '',
    domains: '',
    email: '',
    linkedin: '',
    github: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const avatarRef = useRef();

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        subtitle: profile.subtitle || '',
        domains: profile.domains?.join(', ') || '',
        email: profile.email || '',
        linkedin: profile.linkedin || '',
        github: profile.github || '',
      });
      setAvatarPreview(profile.avatarUrl || null);
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('subtitle', form.subtitle);
      fd.append('email', form.email);
      fd.append('linkedin', form.linkedin);
      fd.append('github', form.github);
      const domainsArray = form.domains
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);
      fd.append('domains', JSON.stringify(domainsArray));
      if (avatarFile) fd.append('avatar', avatarFile);
      await onUpdate(fd);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.form
      className={styles.form}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>Edit Profile</h2>
        <p className={styles.formSubtitle}>Changes appear live on the public portfolio</p>
      </div>

      <div className={styles.avatarRow}>
        <div className={styles.avatarWrap} onClick={() => avatarRef.current.click()}>
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar" className={styles.avatarImg} />
          ) : (
            <div className={styles.avatarEmpty}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
          <div className={styles.avatarOverlay}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatar} style={{ display: 'none' }} />
        </div>
        <div className={styles.avatarHint}>
          <p className={styles.avatarHintTitle}>Profile Photo</p>
          <p className={styles.avatarHintSub}>Click to upload · JPG, PNG, WebP</p>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Full Name <span className={styles.req}>*</span></label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className={styles.input} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Subtitle</label>
          <input name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="e.g. CS Student · Aspiring SDE" className={styles.input} />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Skill Tags</label>
        <input
          name="domains"
          value={form.domains}
          onChange={handleChange}
          placeholder="Java, Python, React (comma separated) — leave empty to hide tags"
          className={styles.input}
        />
        <p className={styles.hint}>Leave blank to hide the tags row completely</p>
      </div>

      <div className={styles.divider}>
        <span>Contact Links</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Email</label>
        <input name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={styles.input} type="email" />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>LinkedIn URL</label>
          <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourhandle" className={styles.input} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>GitHub URL</label>
          <input name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/yourhandle" className={styles.input} />
        </div>
      </div>

      <button type="submit" className={styles.saveBtn} disabled={saving}>
        {saving ? <span className={styles.spinner} /> : (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Save Profile
          </>
        )}
      </button>
    </motion.form>
  );
};

export default ProfileEditor;
