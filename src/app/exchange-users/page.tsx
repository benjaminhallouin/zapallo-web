/**
 * Exchange Users list page
 *
 * Displays exchange users filtered by a selected exchange with sorting capabilities
 */

'use client';

import { useEffect, useState } from 'react';
import { getExchangeUsers, getExchanges } from '@/lib/api';
import type { GetExchangeUsersParams } from '@/lib/api/exchangeUsers';
import type { ExchangeUser, Exchange } from '@/lib/types';
import { ExchangeUserList } from '@/components/exchangeUsers/ExchangeUserList';
import { Loading } from '@/components/ui/Loading';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Select } from '@/components/ui/Select';

type SortField = 'name' | 'external_user_id' | 'created_at' | 'updated_at';
type SortOrder = 'asc' | 'desc';

export default function ExchangeUsersPage() {
  const [users, setUsers] = useState<ExchangeUser[]>([]);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [selectedExchangeId, setSelectedExchangeId] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load exchanges on mount
  const fetchExchanges = async () => {
    setLoading(true);
    setError(null);
    try {
      const exchangesData = await getExchanges();
      setExchanges(exchangesData);
      
      // Auto-select first exchange if available
      if (exchangesData.length > 0 && !selectedExchangeId) {
        setSelectedExchangeId(exchangesData[0].id);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load exchanges';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Load users when exchange/sort changes
  const fetchUsers = async () => {
    if (!selectedExchangeId) {
      setUsers([]);
      return;
    }

    setLoadingUsers(true);
    setError(null);
    try {
      const params: GetExchangeUsersParams = {
        exchange_id: selectedExchangeId,
        sort_by: sortBy,
        sort_order: sortOrder,
      };
      const usersData = await getExchangeUsers(params);
      setUsers(usersData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load exchange users';
      setError(message);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchExchanges();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [selectedExchangeId, sortBy, sortOrder]);

  if (loading) return <Loading />;
  if (error && exchanges.length === 0) {
    return <ErrorMessage message={error} onRetry={fetchExchanges} />;
  }

  const exchangeOptions = exchanges.map((ex) => ({ value: ex.id, label: ex.display_name }));
  
  const sortByOptions = [
    { value: 'created_at', label: 'Created Date' },
    { value: 'updated_at', label: 'Updated Date' },
    { value: 'name', label: 'Name' },
    { value: 'external_user_id', label: 'External User ID' },
  ];

  const sortOrderOptions = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' },
  ];

  return (
    <div className="space-y-6">
      {/* Filters and Sort Controls */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters & Sorting</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Exchange Filter */}
          <Select
            id="exchange-filter"
            label="Exchange"
            options={exchangeOptions}
            value={selectedExchangeId}
            onChange={(e) => setSelectedExchangeId(e.target.value)}
            disabled={exchanges.length === 0}
            placeholder="Select an exchange"
            required
          />

          {/* Sort By */}
          <Select
            id="sort-by"
            label="Sort By"
            options={sortByOptions}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortField)}
            disabled={!selectedExchangeId}
          />

          {/* Sort Order */}
          <Select
            id="sort-order"
            label="Sort Order"
            options={sortOrderOptions}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            disabled={!selectedExchangeId}
          />
        </div>

        {!selectedExchangeId && (
          <p className="text-sm text-gray-600">
            Please select an exchange to view users.
          </p>
        )}
      </div>

      {/* Users List */}
      {loadingUsers ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchUsers} />
      ) : selectedExchangeId ? (
        <ExchangeUserList users={users} exchanges={exchanges} />
      ) : null}
    </div>
  );
}
