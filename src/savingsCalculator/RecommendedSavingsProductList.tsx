import { ReactNode } from 'react';
import { SavingsProduct, Term } from 'savingsCalculator/types';
import { useSavingsProductListQuery } from 'savingsCalculator/useSavingsProductListQuery';
import { 계산_조건에_맞는_적금_상품인지 } from 'savingsCalculator/utils';

type Props = {
  filter: { monthlyPayment: number; term: Term };
  renderListItem: (savingsProduct: SavingsProduct) => ReactNode;
};

export default function RecommendedSavingsProductList({ filter, renderListItem }: Props) {
  const { data, isLoading, error } = useSavingsProductListQuery({
    select: savingsProducts => getRecommendedSavingsProducts({ savingsProducts, filter }),
  });

  if (isLoading || data === undefined) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return data.map(renderListItem);
}

function getRecommendedSavingsProducts({
  savingsProducts,
  filter,
}: {
  savingsProducts: SavingsProduct[];
  filter: { monthlyPayment: number; term: Term };
}) {
  return savingsProducts
    .filter(savingsProduct => 계산_조건에_맞는_적금_상품인지({ savingsProduct, calculationInput: filter }))
    .sort((a, b) => b.annualRate - a.annualRate)
    .slice(0, 2);
}
