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
        <label className={styles.label}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          Email
        </label>
        <input name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={styles.input} type="email" />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
            </svg>
            LinkedIn URL
          </label>
          <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourhandle" className={styles.input} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub URL
          </label>
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
