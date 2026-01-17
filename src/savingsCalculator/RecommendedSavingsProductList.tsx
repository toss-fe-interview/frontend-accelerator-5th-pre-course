import { ReactNode } from 'react';
import { SavingsProduct, Term } from 'savingsCalculator/types';
import { useSavingsProductListQuery } from 'savingsCalculator/useSavingsProductListQuery';
import { 계산_조건에_맞는_적금_상품인지 } from 'savingsCalculator/utils';
import { Assets, colors, ListRow } from 'tosslib';

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

type RecommendedSavingsProductListItemProps = {
  savingsProduct: SavingsProduct;
  isSelected: boolean;
};

RecommendedSavingsProductList.Item = function RecommendedSavingsProductListItem({
  savingsProduct,
  isSelected,
}: RecommendedSavingsProductListItemProps) {
  return (
    <ListRow
      key={savingsProduct.id}
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={savingsProduct.name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${savingsProduct.annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${savingsProduct.minMonthlyAmount.toLocaleString('ko-KR')}원 ~ ${savingsProduct.maxMonthlyAmount.toLocaleString('ko-KR')}원 | ${savingsProduct.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : null}
    />
  );
};
