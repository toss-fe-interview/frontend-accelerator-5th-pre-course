import { colors, ListRow, Border, ListHeader, Spacing, Assets } from 'tosslib';
import { SavingsInput, SavingsProduct } from '../types/types';
import { formatCurrency } from '../lib/formatCurrency';
import { extractNumbers } from '../lib/extractNumbers';

export function SavingsCalculationResult({
  selectedSavingsProduct,
  savingsInput,
  recommendedProducts,
}: {
  selectedSavingsProduct: SavingsProduct | null;
  savingsInput: SavingsInput;
  recommendedProducts: SavingsProduct[];
}) {
  const { targetAmount, monthlyAmount, savingsTerm } = savingsInput;

  const calculateExpectedAmount = (): number => {
    if (!selectedSavingsProduct || !monthlyAmount) {
      return 0;
    }

    const monthlyAmountNumber = Number(extractNumbers(monthlyAmount));
    if (isNaN(monthlyAmountNumber)) {
      return 0;
    }

    const annualRateDecimal = selectedSavingsProduct.annualRate / 100;

    return monthlyAmountNumber * savingsTerm * (1 + annualRateDecimal * 0.5);
  };

  const calculateDifference = (): number => {
    if (!targetAmount) {
      return 0;
    }

    const targetAmountNumber = Number(extractNumbers(targetAmount));
    if (isNaN(targetAmountNumber)) {
      return 0;
    }

    const expectedAmount = calculateExpectedAmount();

    return targetAmountNumber - expectedAmount;
  };

  const calculateRecommendedMonthlyAmount = (): number => {
    if (!selectedSavingsProduct || !targetAmount) {
      return 0;
    }

    const targetAmountNumber = Number(extractNumbers(targetAmount));
    if (isNaN(targetAmountNumber)) {
      return 0;
    }

    const annualRateDecimal = selectedSavingsProduct.annualRate / 100;
    const denominator = savingsTerm * (1 + annualRateDecimal * 0.5);
    const recommendedAmount = targetAmountNumber / denominator;

    return Math.round(recommendedAmount / 1000) * 1000;
  };

  const expectedAmount = calculateExpectedAmount();
  const difference = calculateDifference();
  const recommendedMonthlyAmount = calculateRecommendedMonthlyAmount();

  return (
    <>
      <Spacing size={8} />

      {selectedSavingsProduct ? (
        <>
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="예상 수익 금액"
                topProps={{ color: colors.grey600 }}
                bottom={`${formatCurrency(expectedAmount)}원`}
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
                bottom={`${formatCurrency(difference)}원`}
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
                bottom={`${formatCurrency(recommendedMonthlyAmount)}원`}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
              />
            }
          />
        </>
      ) : (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
      )}

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      {recommendedProducts.length > 0 ? (
        recommendedProducts.map(product => (
          <ListRow
            key={product.id}
            contents={
              <ListRow.Texts
                type="3RowTypeA"
                top={product.name}
                topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                middle={`연 이자율: ${product.annualRate}%`}
                middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                bottom={`${formatCurrency(product.minMonthlyAmount)} ~ ${formatCurrency(product.maxMonthlyAmount)} | ${product.availableTerms}개월`}
                bottomProps={{ fontSize: 13, color: colors.grey600 }}
              />
            }
            right={selectedSavingsProduct?.id === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null}
            onClick={() => {}}
          />
        ))
      ) : (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="추천 상품이 없습니다." />} />
      )}

      <Spacing size={40} />
    </>
  );
}
