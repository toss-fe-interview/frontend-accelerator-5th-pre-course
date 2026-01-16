import { useSearchParams } from 'react-router-dom';
import z from 'zod';

const SavingsProductSearchParamsSchema = z.object({
  goalAmount: z.coerce.number().optional(),
  monthlyAmount: z.coerce.number().optional(),
  term: z.coerce.number().optional(),
  tab: z.enum(['products', 'results']).optional().default('products').catch('products'),
});

type Filters = z.infer<typeof SavingsProductSearchParamsSchema>;

const useSavingsProductSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = SavingsProductSearchParamsSchema.parse(Object.fromEntries(searchParams));

  const updateFilters = (filterUpdater: Filters | ((prevFilters: Filters) => Filters)) => {
    const newFilters = typeof filterUpdater === 'function' ? filterUpdater(filters) : filterUpdater;
    const newSearchParams = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === 'number' && value <= 0) {
          newSearchParams.delete(key);
          return;
        }
        newSearchParams.set(key, value.toString());
      }
    });
    setSearchParams(newSearchParams);
  };

  return { filters, updateFilters };
};

export { useSavingsProductSearchParams };
