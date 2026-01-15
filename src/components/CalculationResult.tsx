import { Border, colors, ListRow, Spacing } from 'tosslib';
import { type ProductItem } from 'types/products';
import { CalculatorForm } from 'types/calculate';
import { roundToThousand } from 'utils/number';

function savingCalculator(userInput: CalculatorForm, targetProduct?: ProductItem) {
  if (!targetProduct) {
    return {
      getExpectedReturnAmount() {
        return 0;
      },
      getTargetGapAmount() {
        return 0;
      },
      getRecommendedMonthlyContribution() {
        return 0;
      },
    };
  }
  return {
    // 최종 금액 = 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)
    getExpectedReturnAmount() {
      return Number(userInput.monthlyPayment) * userInput.savingPeriod * (1 + targetProduct.annualRate * 0.5);
    },
    // 목표 금액과의 차이 = 목표 금액 - 예상 수익 금액
    getTargetGapAmount() {
      return Number(userInput.targetAmount) - this.getExpectedReturnAmount();
    },
    // 월 납입액 = 목표 금액 ÷ (저축 기간 * (1 + 연이자율 * 0.5))
    getRecommendedMonthlyContribution() {
      return Number(userInput.targetAmount) / (userInput.savingPeriod * (1 + targetProduct.annualRate * 0.5));
    },
  };
}

function getRecommendProducts(products: ProductItem[]) {
  return products.sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);
}

interface CalculationResultProps {
  products: ProductItem[];
  userInput: CalculatorForm;
  render: (products: ProductItem[]) => JSX.Element;
}

export default function CalculationResult({ products, userInput, render }: CalculationResultProps) {
  const selectedProduct = products.find(product => product.isSelected);
  const caculator = savingCalculator(userInput, selectedProduct);
  const recommendedProducts = getRecommendProducts(products);

  // 예상 수익 금액
  const expectedReturnAmount = caculator.getExpectedReturnAmount();
  // 목표 금액과의 차이
  const targetGapAmount = caculator.getTargetGapAmount();
  // 추천 월 납입 금액
  const recommendedMonthlyContribution = caculator.getRecommendedMonthlyContribution();

  return (
    <>
      <Spacing size={8} />
      {selectedProduct ? (
        <>
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="예상 수익 금액"
                topProps={{ color: colors.grey600 }}
                bottom={`${roundToThousand(expectedReturnAmount).toLocaleString()}원`}
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
                bottom={`${roundToThousand(targetGapAmount).toLocaleString()}원`}
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
                bottom={`${roundToThousand(recommendedMonthlyContribution).toLocaleString()}원`}
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

      {render(recommendedProducts)}

      <Spacing size={40} />
    </>
  );
}
