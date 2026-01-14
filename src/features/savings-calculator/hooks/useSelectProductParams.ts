import { parseAsString, useQueryState } from 'nuqs';

export function useSelectProductParams() {
  const [productId, setProductId] = useQueryState('productId', parseAsString);

  return {
    selectedProductId: productId,
    setSelectedProductId: setProductId,
  };
}
