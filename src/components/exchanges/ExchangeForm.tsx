/**
 * ExchangeForm component
 *
 * Reusable form component for creating and editing exchanges
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Exchange } from '@/lib/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const exchangeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  display_name: z
    .string()
    .min(1, 'Display name is required')
    .max(255, 'Display name must be 255 characters or less'),
});

type FormData = z.infer<typeof exchangeSchema>;

interface ExchangeFormProps {
  exchange?: Exchange;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

export function ExchangeForm({ exchange, onSubmit, onCancel }: ExchangeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(exchangeSchema),
    defaultValues: exchange
      ? {
          name: exchange.name,
          display_name: exchange.display_name,
        }
      : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        id="name"
        label="Name"
        {...register('name')}
        error={errors.name?.message}
        required
        placeholder="e.g., cardmarket"
      />

      <Input
        id="display_name"
        label="Display Name"
        {...register('display_name')}
        error={errors.display_name?.message}
        required
        placeholder="e.g., CardMarket"
      />

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : exchange ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
