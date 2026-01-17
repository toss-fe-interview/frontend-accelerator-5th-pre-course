import { useSavingsProductListQuery } from 'savingsCalculator/useSavingsProductListQuery';
import { SavingsProduct, Term } from 'savingsCalculator/types';
import { 계산_조건에_맞는_적금_상품인지 } from 'savingsCalculator/utils';
import { ReactNode } from 'react';
import { Assets, colors, ListRow } from 'tosslib';

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

type SavingsProductListItemProps = {
  savingsProduct: SavingsProduct;
  isSelected: boolean;
  onSelect: (savingsProduct: SavingsProduct) => void;
};

SavingsProductList.Item = function SavingsProductListItem({
  savingsProduct,
  isSelected,
  onSelect,
}: SavingsProductListItemProps) {
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
      onClick={() => onSelect(savingsProduct)}
    />
  );
};
