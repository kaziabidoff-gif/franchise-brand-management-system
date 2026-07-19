import { useCallback, useEffect, useState } from 'react';
import { listResource } from '../services/resourceService';

export default function useResourceList(endpoint, initialParams = {}) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [params, setParams] = useState({ page: 1, limit: 10, ...initialParams });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await listResource(endpoint, params);
      setRows(response.data || []);
      setMeta(response.meta || null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load records.');
    } finally {
      setLoading(false);
    }
  }, [endpoint, params]);

  useEffect(() => {
    load();
  }, [load]);

  const setSearch = (search) => setParams((current) => ({ ...current, search, page: 1 }));
  const setFilter = (key, value) => setParams((current) => ({ ...current, [key]: value, page: 1 }));
  const setPage = (page) => setParams((current) => ({ ...current, page }));

  return { rows, meta, params, loading, error, reload: load, setSearch, setFilter, setPage };
}
