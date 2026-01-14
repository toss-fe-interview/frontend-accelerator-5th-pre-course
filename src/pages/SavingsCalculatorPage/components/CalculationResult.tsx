import { Assets, Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { SavingsProduct } from '../models/savings-products.dto';
import { formatCurrency } from 'utils/format';
import { SavingsCalculatorTerm, SavingsFilterForm } from '../types/saving-filter-form';

interface Props extends SavingsFilterForm {
  selectedProduct: SavingsProduct | null;
  products: SavingsProduct[];
  onSelectProduct: (product: SavingsProduct) => void;
}

export function CalculationResult({
  targetAmount,
  monthlyPayment,
  term,
  selectedProduct,
  products,
  onSelectProduct,
}: Props) {
  if (!selectedProduct) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  if (!targetAmount || !monthlyPayment || !term) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="모든 필수 값을 입력해주세요." />} />;
  }

  const expectedAmount = calculateExpectedAmount(monthlyPayment, term, selectedProduct.annualRate);
  const difference = targetAmount - expectedAmount;
  const recommendedMonthlyPayment = calculateRecommendedMonthly(targetAmount, term, selectedProduct.annualRate);
  const recommendedProducts = getRecommendedProducts(products);

  return (
    <>
      <Spacing size={8} />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatCurrency(Math.round(expectedAmount))}원`}
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
            bottom={`${formatDifference(difference)}원`}
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
            bottom={`${formatCurrency(recommendedMonthlyPayment)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />
      {recommendedProducts.map(product => (
        <ListRow
          key={product.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${product.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${formatCurrency(product.minMonthlyAmount)}원 ~ ${formatCurrency(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={selectedProduct?.id === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null}
          onClick={() => onSelectProduct(product)}
        />
      ))}
    </>
  );
}

function calculateExpectedAmount(monthlyPayment: number, term: SavingsCalculatorTerm, annualRate: number): number {
  const 연이율 = annualRate / 100;
  const 적금평균이자기간비율 = 0.5;
  const 최종금액비율 = 1 + 연이율 * 적금평균이자기간비율;

  return monthlyPayment * term * 최종금액비율;
}

function calculateRecommendedMonthly(targetAmount: number, term: SavingsCalculatorTerm, annualRate: number): number {
  const 연이율 = annualRate / 100;
  const 적금평균이자기간비율 = 0.5;
  const 최종금액비율 = 1 + 연이율 * 적금평균이자기간비율;
  const 월납입금액반올림단위 = 1000;

  return Math.round(targetAmount / (term * 최종금액비율) / 월납입금액반올림단위) * 월납입금액반올림단위;
}

function getRecommendedProducts(products: SavingsProduct[], count = 2): SavingsProduct[] {
  return products.sort((a, b) => b.annualRate - a.annualRate).slice(0, count);
}

function formatDifference(difference: number): string {
  const sign = difference > 0 ? '-' : '+';
  return `${sign}${formatCurrency(Math.abs(difference))}`;
}
