/**
 * ExchangeUserForm component
 *
 * Reusable form component for creating and editing exchange users
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { getExchanges } from '@/lib/api';
import type { ExchangeUser, Exchange } from '@/lib/types';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';

const exchangeUserSchema = z.object({
  exchange_id: z.string().uuid('Select an exchange'),
  external_user_id: z
    .string()
    .min(1, 'External user ID is required')
    .max(255, 'External user ID must be 255 characters or less'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be 255 characters or less'),
});

type FormData = z.infer<typeof exchangeUserSchema>;

interface ExchangeUserFormProps {
  user?: ExchangeUser;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

export function ExchangeUserForm({ user, onSubmit, onCancel }: ExchangeUserFormProps) {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loadingExchanges, setLoadingExchanges] = useState(true);
  const [exchangeError, setExchangeError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(exchangeUserSchema),
    defaultValues: user
      ? {
          exchange_id: user.exchange_id,
          external_user_id: user.external_user_id,
          name: user.name,
        }
      : undefined,
  });

  useEffect(() => {
    async function fetchExchanges() {
      try {
        setLoadingExchanges(true);
        setExchangeError(null);
        const data = await getExchanges();
        setExchanges(data);
        
        if (data.length === 0) {
          setExchangeError('No exchanges available. Please create an exchange first.');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load exchanges';
        setExchangeError(message);
      } finally {
        setLoadingExchanges(false);
      }
    }

    fetchExchanges();
  }, []);

  if (loadingExchanges) {
    return (
      <div className="py-8">
        <Loading />
      </div>
    );
  }

  if (exchangeError) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading exchanges</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{exchangeError}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const exchangeOptions = exchanges.map((exchange) => ({
    value: exchange.id,
    label: exchange.display_name,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Select
        id="exchange_id"
        label="Exchange"
        options={exchangeOptions}
        {...register('exchange_id')}
        error={errors.exchange_id?.message}
        required
        placeholder="Select an exchange..."
      />

      <Input
        id="external_user_id"
        label="External User ID"
        {...register('external_user_id')}
        error={errors.external_user_id?.message}
        required
        placeholder="e.g., ext_12345"
      />

      <Input
        id="name"
        label="Name"
        {...register('name')}
        error={errors.name?.message}
        required
        placeholder="e.g., john_doe"
      />

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting || exchanges.length === 0}>
          {isSubmitting ? 'Saving...' : user ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
