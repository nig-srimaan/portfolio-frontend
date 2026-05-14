import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await api.get('/profile');
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (formData) => {
    const { data } = await api.put('/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setProfile(data);
    return data;
  }, []);

  return { profile, loading, updateProfile, refetch: fetchProfile };
};

export default useProfile;
