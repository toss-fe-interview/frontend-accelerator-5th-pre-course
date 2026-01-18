import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import SavingsQuery from 'shared/query/saving';
import { SavingsProductType } from 'shared/types/api/savings';

interface GetSavingsProductsProps {
  queryOptions?: Omit<UseQueryOptions<SavingsProductType[]>, 'queryKey' | 'queryFn'>;
  children: (savingsProducts: SavingsProductType[]) => React.ReactNode;
}

export default function GetSavingsProducts({ queryOptions, children }: GetSavingsProductsProps) {
  const { data: savingsProducts = [] } = useQuery(
    SavingsQuery.getSavingsProducts({
      ...queryOptions,
    })
  );

  return children(savingsProducts);
}
