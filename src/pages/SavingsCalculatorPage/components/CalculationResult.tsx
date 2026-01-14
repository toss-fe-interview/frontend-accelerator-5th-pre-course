import { Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { SavingsProduct } from '../models/savings-products.dto';
import { formatCurrency } from 'utils/format';
import { SavingsFilterForm } from '../types/saving-filter-form';

interface Props extends SavingsFilterForm {
  selectedProduct: SavingsProduct | null;
  products: SavingsProduct[];
}

export function CalculationResult({ targetAmount, monthlyPayment, term, selectedProduct, products }: Props) {
  if (!selectedProduct) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  if (!targetAmount || !monthlyPayment || !term) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="모든 필수 값을 입력해주세요." />} />;
  }

  const annualRate = selectedProduct.annualRate;
  const rateMultiplier = 1 + (annualRate / 100) * 0.5;

  // 예상 수익 금액
  const expectedAmount = monthlyPayment * term * rateMultiplier;

  const difference = targetAmount - expectedAmount;

  // 추천 월 납입 금액 (1,000원 단위 반올림)
  const recommendedMonthlyPayment = Math.round(targetAmount / (term * rateMultiplier) / 1000) * 1000;

  const recommendedProducts = products.sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

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
            bottom={`${formatCurrency(Math.round(difference))}원`}
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
          onClick={() => {}}
        />
      ))}
    </>
  );
}
