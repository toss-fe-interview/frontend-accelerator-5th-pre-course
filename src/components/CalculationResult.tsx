import { SavingsInput, SavingsProduct } from 'pages/SavingsCalculatorPage';
import { Border, colors, ListRow, Spacing, ListHeader } from 'tosslib';
import { formatMoney } from 'utils/money';
import SavingsProductItem from 'components/SavingsProductItem';

interface CalculationResultProps {
  selectedSavingsProduct: SavingsProduct | null;
  savingsInput: SavingsInput;
  filteredSavingsProducts: SavingsProduct[];
}

const CalculationResult = (props: CalculationResultProps) => {
  const { selectedSavingsProduct, savingsInput, filteredSavingsProducts } = props;

  const topRecommendedProducts = [...filteredSavingsProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  const calculateResults = () => {
    if (!selectedSavingsProduct) {
      return null;
    }

    const monthlyAmount = Number(savingsInput.monthlyAmount);
    const term = savingsInput.term;
    const goalAmount = Number(savingsInput.goalAmount);
    const annualRate = selectedSavingsProduct.annualRate / 100;
    const expectedAmount = monthlyAmount * term * (1 + annualRate * 0.5);
    const difference = goalAmount - expectedAmount;
    const recommendedMonthlyAmount = Math.round(goalAmount / (term * (1 + annualRate * 0.5)) / 1000) * 1000;

    return {
      expectedAmount,
      difference,
      recommendedMonthlyAmount,
    };
  };

  const results = calculateResults();

  return (
    <div>
      {selectedSavingsProduct && results ? (
        <>
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="예상 수익 금액"
                topProps={{ color: colors.grey600 }}
                bottom={`${formatMoney(Math.round(results.expectedAmount))}원`}
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
                bottom={`${results.difference >= 0 ? '+' : ''}${formatMoney(Math.round(results.difference))}원`}
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
                bottom={`${formatMoney(results.recommendedMonthlyAmount)}원`}
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

      {topRecommendedProducts.map(product => (
        <SavingsProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default CalculationResult;
