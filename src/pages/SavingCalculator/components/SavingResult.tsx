import { Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { SavingsProduct } from '../api';
import { CalculInputs } from '../SavingsCalculatorPage';
import { formatToKRW } from '../util';
import { SavingItem } from './SavingItemList';

interface SavingResultProps {
  selectedProduct: SavingsProduct | null;
  calculInputs: CalculInputs;
  recommendedProducts: SavingsProduct[];
}

/**
 * 선택된 적금 상품과, 적금 계산기 입력을 바탕으로 결과 값만 제공해주자.
 */
export default function SavingResult({ selectedProduct, calculInputs, recommendedProducts }: SavingResultProps) {
  const { monthlyAmount, term, targetAmount } = calculInputs;
  const annualRate = selectedProduct?.annualRate ?? 0;
  const factor = 1 + annualRate * 0.5;

  const expectedProfit = monthlyAmount * term * factor;
  const difference = targetAmount - expectedProfit;
  const recommendedMonthly = term === 0 ? 0 : targetAmount / (term * factor);

  const isProductSelected = selectedProduct !== null;
  return (
    <>
      <CalculationResult
        expectedProfit={expectedProfit}
        difference={difference}
        recommendedMonthly={recommendedMonthly}
        isProductSelected={isProductSelected}
      />
      <Border height={16} />
      <RecommendedProductList products={recommendedProducts} />
    </>
  );
}

function NoProductSelected() {
  return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
}

interface CalculationResultProps {
  expectedProfit: number;
  difference: number;
  recommendedMonthly: number;
  isProductSelected: boolean;
}

function CalculationResult({
  expectedProfit,
  difference,
  recommendedMonthly,
  isProductSelected,
}: CalculationResultProps) {
  return (
    <>
      <Spacing size={8} />
      {isProductSelected ? (
        <>
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="예상 수익 금액"
                topProps={{ color: colors.grey600 }}
                bottom={`${formatToKRW(expectedProfit)}원`}
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
                bottom={`${formatToKRW(difference)}원`}
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
                bottom={`${formatToKRW(recommendedMonthly)}원`}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
              />
            }
          />
        </>
      ) : (
        <NoProductSelected />
      )}
      <Spacing size={8} />{' '}
    </>
  );
}

interface RecommendedProductListProps {
  products: SavingsProduct[];
}

function RecommendedProductList({ products }: RecommendedProductListProps) {
  return (
    <>
      <Spacing size={8} />
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />
      {products.map(product => (
        <SavingItem key={product.id} product={product} selectedProduct={null} onSelect={() => {}} />
      ))}
      <Spacing size={40} />
    </>
  );
}
