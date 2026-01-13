import { useSuspenseQuery } from '@tanstack/react-query';
import { SavingsCalculatorFormData } from 'hooks/useSavingsCalculatorForm';
import { Assets, colors, http, ListRow } from 'tosslib';
import { SavingsProduct } from 'type';
import { formatCurrency } from 'utils/format';

type SavingsProductListProps = Omit<SavingsCalculatorFormData, 'targetAmount'> & {
  selectedProductId?: string;
  onSelectedProduct: (product: SavingsProduct) => void;
};

export function SavingsProductList({
  monthlyAmount,
  availableTerms,
  selectedProductId,
  onSelectedProduct,
}: SavingsProductListProps) {
  const { data } = useSuspenseQuery({
    queryKey: ['savings-products'],
    queryFn: () => http.get<SavingsProduct[]>('/api/savings-products'),
  });

  const filteredData = data.filter(
    product =>
      product.minMonthlyAmount <= monthlyAmount &&
      product.maxMonthlyAmount >= monthlyAmount &&
      product.availableTerms <= availableTerms
  );

  return filteredData.map((product: SavingsProduct) => (
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
      onClick={() => onSelectedProduct(product)}
    />
  ));
}
