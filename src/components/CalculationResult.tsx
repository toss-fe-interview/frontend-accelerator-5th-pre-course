import { get반기예상연이자율 } from 'domains/savings-product';
import { orderBy, take } from 'es-toolkit';
import { defaultTo } from 'es-toolkit/compat';
import { Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import type { SavingsProduct } from 'types';
import { SavingsProductRecord } from './SavingsProductRecord';

interface CalculationResultProps {
  selectedSavingsProduct: SavingsProduct;
  savingsProducts: SavingsProduct[];
  monthlyAmount?: number;
  term?: number;
  goalAmount?: number;
}

const CalculationResult = ({
  selectedSavingsProduct,
  savingsProducts,
  goalAmount,
  monthlyAmount,
  term,
}: CalculationResultProps) => {
  const expectedProfitAmount =
    defaultTo(monthlyAmount, 1) * defaultTo(term, 1) * get반기예상연이자율(selectedSavingsProduct.annualRate);

  const differenceFromGoalAmount = defaultTo(goalAmount, 0) - expectedProfitAmount;

  const recommendedMonthlyAmount =
    defaultTo(goalAmount, 0) / (defaultTo(term, 1) * get반기예상연이자율(selectedSavingsProduct.annualRate));

  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${expectedProfitAmount.toLocaleString()}원`}
            bottomProps={{
              fontWeight: 'bold',
              color: colors.blue600,
            }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="목표 금액과의 차이"
            topProps={{ color: colors.grey600 }}
            bottom={`${differenceFromGoalAmount.toLocaleString()}원`}
            bottomProps={{
              fontWeight: 'bold',
              color: colors.blue600,
            }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="추천 월 납입 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${Math.round(recommendedMonthlyAmount).toLocaleString()}원`}
            bottomProps={{
              fontWeight: 'bold',
              color: colors.blue600,
            }}
          />
        }
      />
      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />
      {take(orderBy(savingsProducts, ['annualRate'], ['desc']), 2).map(savingsProduct => {
        return (
          <SavingsProductRecord
            key={savingsProduct.id}
            savingsProduct={savingsProduct}
            selected={selectedSavingsProduct?.id === savingsProduct.id}
            onSelect={() => {}}
          />
        );
      })}

      <Spacing size={40} />
    </>
  );
};

export { CalculationResult };
