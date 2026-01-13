import { Assets, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { formatCurrency } from 'utils/format';
import { SavingsCalculatorFormData } from 'hooks/useSavingsCalculatorForm';
import type { SavingsProduct } from 'api/savings';
import { useSavingsProducts } from 'hooks/useSavingsProducts';

type RecommendedProductListProps = Omit<SavingsCalculatorFormData, 'targetAmount'> & {
  selectedProductId?: string;
};

export function RecommendedProductList({
  monthlyAmount,
  availableTerms,
  selectedProductId,
}: RecommendedProductListProps) {
  const { products } = useSavingsProducts({ monthlyAmount, availableTerms });

  const filteredData = products.sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  return (
    <>
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />
      {filteredData.map((product: SavingsProduct) => (
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
          right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
        />
      ))}
    </>
  );
}
