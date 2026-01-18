import { parseAsString, useQueryState } from 'nuqs';

export function useSelectedProductId() {
  return useQueryState('selectedProductId', parseAsString);
}
