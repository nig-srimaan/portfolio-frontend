import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const usePortfolio = (category = 'All', search = '') => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      const { data } = await api.get('/portfolio', { params });
      setItems(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load portfolio items');
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const likeItem = useCallback(async (id) => {
    try {
      const { data } = await api.patch(`/portfolio/${id}/like`);
      setItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, likes: data.likes } : item))
      );
    } catch (err) {
      console.error('Failed to like item', err);
    }
  }, []);

  const deleteItem = useCallback(async (id) => {
    await api.delete(`/portfolio/${id}`);
    setItems((prev) => prev.filter((item) => item._id !== id));
  }, []);

  return { items, loading, error, refetch: fetchItems, likeItem, deleteItem };
};

export default usePortfolio;
