/**
 * ExchangeUserList component
 *
 * Displays a table of exchange users with navigation to detail view
 */

'use client';

import Link from 'next/link';
import { ExchangeUser, Exchange } from '@/lib/types';

type SortField = 'name' | 'external_user_id' | 'created_at' | 'updated_at';
type SortOrder = 'asc' | 'desc';

interface ExchangeUserListProps {
  users: ExchangeUser[];
  exchanges: Exchange[];
  selectedExchangeId: string;
  onExchangeChange: (exchangeId: string) => void;
  sortBy: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}

export function ExchangeUserList({ 
  users, 
  exchanges, 
  selectedExchangeId,
  onExchangeChange,
  sortBy,
  sortOrder,
  onSort 
}: ExchangeUserListProps) {
  const getExchangeName = (exchangeId: string) => {
    return exchanges.find((e) => e.id === exchangeId)?.display_name ?? 'Unknown Exchange';
  };

  const getSortIcon = (field: SortField) => {
    if (sortBy !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    if (sortOrder === 'asc') {
      return (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No exchange users found</h3>
        <p className="text-gray-500 mb-4">Get started by creating your first exchange user.</p>
        <Link
          href="/exchange-users/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Exchange User
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Exchange Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all user accounts on trading platforms where cards can be bought and sold.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/exchange-users/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Exchange User
          </Link>
        </div>
      </div>

      {/* Segmented Control for Exchange Selection */}
      <div className="mt-6">
        <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 shadow-sm">
          {exchanges.map((exchange) => (
            <button
              key={exchange.id}
              type="button"
              onClick={() => onExchangeChange(exchange.id)}
              className={`
                px-4 py-2 text-sm font-medium rounded-md transition-all
                ${
                  selectedExchangeId === exchange.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              {exchange.display_name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      <button
                        type="button"
                        onClick={() => onSort('name')}
                        className="group inline-flex items-center gap-1 hover:text-blue-600"
                      >
                        Name
                        {getSortIcon('name')}
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      <button
                        type="button"
                        onClick={() => onSort('external_user_id')}
                        className="group inline-flex items-center gap-1 hover:text-blue-600"
                      >
                        External ID
                        {getSortIcon('external_user_id')}
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      <button
                        type="button"
                        onClick={() => onSort('created_at')}
                        className="group inline-flex items-center gap-1 hover:text-blue-600"
                      >
                        Created
                        {getSortIcon('created_at')}
                      </button>
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.external_user_id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          href={`/exchange-users/${user.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View<span className="sr-only">, {user.name}</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
