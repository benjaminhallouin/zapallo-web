/**
 * Exchange detail page
 *
 * Displays detailed information about a single exchange
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getExchange } from '@/lib/api';
import { NotFoundError } from '@/lib/api';
import type { Exchange } from '@/lib/types';
import { ExchangeDetail } from '@/components/exchanges/ExchangeDetail';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function ExchangeDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [exchange, setExchange] = useState<Exchange | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExchange = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExchange(id);
      setExchange(data);
    } catch (err) {
      if (err instanceof NotFoundError) {
        setError('Exchange not found');
      } else {
        const message = err instanceof Error ? err.message : 'Failed to load exchange';
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchExchange();
    }
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchExchange} />;
  if (!exchange) return <ErrorMessage message="Exchange not found" />;

  return <ExchangeDetail exchange={exchange} />;
}
