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

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with default desc order
      setSortBy(field);
      setSortOrder('desc');
    }
  };

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
return (
    <>
      {loadingUsers ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchUsers} />
      ) : selectedExchangeId ? (
        <ExchangeUserList 
          users={users} 
          exchanges={exchanges}
          selectedExchangeId={selectedExchangeId}
          onExchangeChange={setSelectedExchangeId}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Please select an exchange to view users.</p>
        </div>
      )}
    </iv>

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
