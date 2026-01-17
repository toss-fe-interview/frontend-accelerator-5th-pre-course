import { ReactNode } from 'react';
import { useSavingsProductListQuery } from 'services/useSavingsProductListQuery';
import { SavingsProduct } from 'types';

type Props = {
  children: (savingsProducts: SavingsProduct[]) => ReactNode;
};

export default function GetSavingsProducts({ children }: Props) {
  const { data, isLoading, error } = useSavingsProductListQuery();

  if (isLoading || data === undefined) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return children(data);
}
