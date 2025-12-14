/**
 * Exchange User detail page
 *
 * Displays detailed information about a single exchange user
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getExchangeUser, getExchange } from '@/lib/api';
import { NotFoundError } from '@/lib/api';
import type { ExchangeUser, Exchange } from '@/lib/types';
import { ExchangeUserDetail } from '@/components/exchangeUsers/ExchangeUserDetail';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function ExchangeUserDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<ExchangeUser | null>(null);
  const [exchange, setExchange] = useState<Exchange | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await getExchangeUser(id);
      setUser(userData);
      
      // Fetch the associated exchange
      try {
        const exchangeData = await getExchange(userData.exchange_id);
        setExchange(exchangeData);
      } catch (err) {
        // Exchange might have been deleted, continue without it
        console.warn('Failed to fetch exchange:', err);
      }
    } catch (err) {
      if (err instanceof NotFoundError) {
        setError('Exchange user not found');
      } else {
        const message = err instanceof Error ? err.message : 'Failed to load exchange user';
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
  if (!user) return <ErrorMessage message="Exchange user not found" />;

  return <ExchangeUserDetail user={user} exchange={exchange} />;
}
