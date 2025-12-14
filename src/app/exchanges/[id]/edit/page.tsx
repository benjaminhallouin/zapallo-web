/**
 * Edit Exchange Page
 *
 * Page for editing an existing exchange
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ExchangeForm } from '@/components/exchanges/ExchangeForm';
import { apiClient } from '@/lib/api/client';
import { Exchange } from '@/lib/types';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Toast } from '@/components/ui/Toast';

type ToastState = {
  show: boolean;
  message: string;
  type: 'success' | 'error';
} | null;

export default function EditExchangePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [exchange, setExchange] = useState<Exchange | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    const fetchExchange = async () => {
      try {
        const data = await apiClient.getExchange(id);
        setExchange(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load exchange');
      } finally {
        setLoading(false);
      }
    };

    fetchExchange();
  }, [id]);

  const handleSubmit = async (data: { name: string; display_name: string }) => {
    try {
      await apiClient.updateExchange(id, data);
      setToast({
        show: true,
        message: 'Exchange updated successfully!',
        type: 'success',
      });
      // Redirect after a short delay to show the toast
      setTimeout(() => {
        router.push(`/exchanges/${id}`);
      }, 1500);
    } catch (error) {
      setToast({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to update exchange',
        type: 'error',
      });
    }
  };

  const handleCancel = () => {
    router.push(`/exchanges/${id}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !exchange) {
    return (
      <ErrorMessage
        message={error || 'Exchange not found'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href={`/exchanges/${id}`}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <svg
            className="mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Back to exchange details
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">Edit Exchange</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update the trading platform information
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ExchangeForm
            exchange={exchange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>

      {toast?.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
