import { useEffect, useState } from 'react';
import api from '../services/api';

export default function useOptions() {
  const [options, setOptions] = useState({
    roles: [],
    branches: [],
    assets: [],
    campaigns: [],
    users: []
  });

  useEffect(() => {
    const load = async () => {
      const requests = [
        api.get('/users/roles').catch(() => ({ data: { data: [] } })),
        api.get('/branches/options').catch(() => ({ data: { data: [] } })),
        api.get('/assets/options').catch(() => ({ data: { data: [] } })),
        api.get('/campaigns/options').catch(() => ({ data: { data: [] } })),
        api.get('/users', { params: { limit: 100 } }).catch(() => ({ data: { data: [] } }))
      ];

      const [roles, branches, assets, campaigns, users] = await Promise.all(requests);
      setOptions({
        roles: roles.data.data || [],
        branches: branches.data.data || [],
        assets: assets.data.data || [],
        campaigns: campaigns.data.data || [],
        users: users.data.data || []
      });
    };

    load();
  }, []);

  return options;
}
