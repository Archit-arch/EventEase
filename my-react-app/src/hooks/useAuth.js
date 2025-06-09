// src/hooks/useAuth.js

import { useState, useEffect } from 'react';
import api from '../api/axios'; // make sure this path matches your project structure

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);  // assuming backend sends { user: {...} }
        setError(null);
      } catch (err) {
        setUser(null);
        setError('Not authenticated');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, loading, error, setUser };
}
