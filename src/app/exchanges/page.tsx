/**
 * Exchanges list page
 *
 * Displays all exchanges in a table with loading/error states
 */

'use client';

import { useEffect, useState } from 'react';
import { getExchanges } from '@/lib/api';
import type { Exchange } from '@/lib/types';
import { ExchangeList } from '@/components/exchanges/ExchangeList';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function ExchangesPage() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExchanges = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExchanges();
      setExchanges(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load exchanges';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchanges();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchExchanges} />;

  return <ExchangeList exchanges={exchanges} />;
}
