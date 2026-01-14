import { Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { SavingsProduct } from 'types/savings';
import { ProductList } from './ProductList';

interface CalculationResultProps {
  expectedAmount: number;
  differenceFromTarget: number;
  recommendedMonthlyAmount: number;
  recommendedProducts: SavingsProduct[];
  selectedProductId: string | null;
  onSelectProduct: (productId: string) => void;
}

const formatNumber = (num: number) => {
  return num.toLocaleString('ko-KR');
};

export function CalculationResult({
  expectedAmount,
  differenceFromTarget,
  recommendedMonthlyAmount,
  recommendedProducts,
  selectedProductId,
  onSelectProduct,
}: CalculationResultProps) {
  return (
    <>
      <Spacing size={8} />

      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${formatNumber(expectedAmount)}원`}
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
            bottom={`${differenceFromTarget >= 0 ? '' : '-'}${formatNumber(Math.abs(differenceFromTarget))}원`}
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
            bottom={`${formatNumber(recommendedMonthlyAmount)}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      <ProductList
        products={recommendedProducts}
        selectedProductId={selectedProductId}
        onSelectProduct={onSelectProduct}
      />

      <Spacing size={40} />
    </>
  );
}
