import { useQueryStates, parseAsInteger } from 'nuqs';

export function useSavingsQueryParams() {
  return useQueryStates({
    targetAmount: parseAsInteger,
    monthlyAmount: parseAsInteger,
    selectedTerm: parseAsInteger,
  });
}
