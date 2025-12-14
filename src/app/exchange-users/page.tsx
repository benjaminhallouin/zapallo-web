/**
 * Exchange Users list page
 *
 * Displays all exchange users in a table with loading/error states
 */

'use client';

import { useEffect, useState } from 'react';
import { getExchangeUsers, getExchanges } from '@/lib/api';
import type { ExchangeUser, Exchange } from '@/lib/types';
import { ExchangeUserList } from '@/components/exchangeUsers/ExchangeUserList';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function ExchangeUsersPage() {
  const [users, setUsers] = useState<ExchangeUser[]>([]);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, exchangesData] = await Promise.all([
        getExchangeUsers(),
        getExchanges(),
      ]);
      setUsers(usersData);
      setExchanges(exchangesData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load exchange users';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

  return <ExchangeUserList users={users} exchanges={exchanges} />;
}
