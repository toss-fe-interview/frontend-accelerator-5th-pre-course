import { SavingsInput, SavingsProduct } from 'type';
import { SavingsProductItem } from 'components/SavingsProductItem';
import { Border, colors, ListRow, Spacing, ListHeader } from 'tosslib';
import { formatMoney } from 'utils/money';
import {
  calculateExpectedAmount,
  calculateGoalDifference,
  calculateRecommendedMonthlyAmount,
} from 'utils/savingsCalculator';

interface CalculationResultProps {
  selectedSavingsProduct: SavingsProduct | null;
  savingsInput: SavingsInput;
  filteredSavingsProducts: SavingsProduct[];
}

export function CalculationResult(props: CalculationResultProps) {
  const { selectedSavingsProduct, savingsInput, filteredSavingsProducts } = props;

  const topRecommendedProducts = [...filteredSavingsProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  if (!selectedSavingsProduct) {
    return (
      <div>
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
      </div>
    );
  }

  const monthlyAmount = savingsInput.monthlyAmount;
  const term = savingsInput.term;
  const goalAmount = savingsInput.goalAmount;
  const annualRate = selectedSavingsProduct.annualRate / 100;

  const expectedAmount = calculateExpectedAmount(monthlyAmount, term, annualRate);
  const difference = calculateGoalDifference(goalAmount, expectedAmount);
  const recommendedMonthlyAmount = calculateRecommendedMonthlyAmount(goalAmount, term, annualRate);

  return (
    <div>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatMoney(Math.round(expectedAmount))}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="목표 금액과의 차이"
            topProps={{ color: colors.grey600 }}
            bottom={`${difference >= 0 ? '+' : ''}${formatMoney(Math.round(difference))}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="추천 월 납입 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatMoney(recommendedMonthlyAmount)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      {topRecommendedProducts.map(product => (
        <SavingsProductItem key={product.id} product={product} />
      ))}
    </div>
  );
}
