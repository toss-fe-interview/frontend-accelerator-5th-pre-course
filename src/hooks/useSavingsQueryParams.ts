import { useQueryStates, parseAsInteger } from 'nuqs';

export function useSavingsQueryParams() {
  return useQueryStates({
    targetAmount: parseAsInteger,
    monthlyPayment: parseAsInteger,
    selectedTerm: parseAsInteger,
  });
}
