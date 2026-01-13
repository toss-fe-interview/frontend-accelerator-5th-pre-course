import { Assets, colors, http, ListHeader, ListRow, Spacing } from 'tosslib';
import { formatCurrency } from 'utils/format';
import { SavingsCalculatorFormData } from 'hooks/useSavingsCalculatorForm';
import { SavingsProduct } from 'type';
import { useSuspenseQuery } from '@tanstack/react-query';

type RecommendedProductListProps = Omit<SavingsCalculatorFormData, 'targetAmount'> & {
  selectedProductId?: string;
};

export function RecommendedProductList({
  monthlyAmount,
  availableTerms,
  selectedProductId,
}: RecommendedProductListProps) {
  const { data } = useSuspenseQuery({
    queryKey: ['savings-products'],
    queryFn: () => http.get<SavingsProduct[]>('/api/savings-products'),
  });

  const filteredData = data
    .filter(
      product =>
        product.minMonthlyAmount <= monthlyAmount &&
        product.maxMonthlyAmount >= monthlyAmount &&
        product.availableTerms <= availableTerms
    )
    .sort((a, b) => b.annualRate - a.annualRate)
    .slice(0, 2);

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
