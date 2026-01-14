import { useQuery } from '@tanstack/react-query';
import { getSavingsProducts } from 'api/remote';

const useSavingsProductsQuery = () => {
  return useQuery({ queryKey: ['savingsProducts'], queryFn: getSavingsProducts });
};

export default useSavingsProductsQuery;
