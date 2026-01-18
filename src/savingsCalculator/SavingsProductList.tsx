import { useSavingsProductListQuery } from 'savingsCalculator/useSavingsProductListQuery';
import { SavingsProduct, Term } from 'savingsCalculator/types';
import { 계산_조건에_맞는_적금_상품인지 } from 'savingsCalculator/utils';
import { ReactNode } from 'react';

type Props = {
  filter: { term: Term; monthlyPayment: number };
  renderListItem: (savingsProduct: SavingsProduct) => ReactNode;
};

export default function SavingsProductList({ filter, renderListItem }: Props) {
  const { data, isLoading, error } = useSavingsProductListQuery({
    select: savingsProducts =>
      savingsProducts.filter(savingsProduct =>
        계산_조건에_맞는_적금_상품인지({ savingsProduct, calculationInput: filter })
      ),
  });

  if (isLoading || data === undefined) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return data.map(renderListItem);
}
