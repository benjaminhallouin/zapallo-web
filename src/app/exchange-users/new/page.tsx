/**
 * Create ExchangeUser Page
 *
 * Page for creating a new exchange user
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ExchangeUserForm } from '@/components/exchangeUsers/ExchangeUserForm';
import { createExchangeUser } from '@/lib/api';
import { Toast } from '@/components/ui/Toast';

type ToastState = {
  show: boolean;
  message: string;
  type: 'success' | 'error';
} | null;

export default function NewExchangeUserPage() {
  const router = useRouter();
  const [toast, setToast] = useState<ToastState>(null);

  const handleSubmit = async (data: {
    exchange_id: string;
    external_user_id: string;
    name: string;
  }) => {
    try {
      const newUser = await createExchangeUser(data);
      setToast({
        show: true,
        message: 'Exchange user created successfully!',
        type: 'success',
      });
      // Redirect to detail page after a short delay to show the toast
      setTimeout(() => {
        router.push(`/exchange-users/${newUser.id}`);
      }, 1500);
    } catch (error) {
      setToast({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to create exchange user',
        type: 'error',
      });
    }
  };

  const handleCancel = () => {
    router.push('/exchange-users');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/exchange-users"
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
          Back to exchange users
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">Create New Exchange User</h1>
        <p className="mt-1 text-sm text-gray-500">Add a new user account on a trading platform</p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ExchangeUserForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>

      {toast?.show && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
