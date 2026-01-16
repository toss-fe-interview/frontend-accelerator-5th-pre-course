import { SavingsProduct } from 'types/savings';
import { Assets, colors, ListRow } from 'tosslib';
import { formatCurrency } from 'utils/format';

export function SavingsProductList({
  savingsProductList,
  selectedProduct,
  onSelectProduct,
}: {
  savingsProductList: SavingsProduct[];
  selectedProduct: SavingsProduct | null;
  onSelectProduct: (product: SavingsProduct) => void;
}) {
  return savingsProductList.map(product => (
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
  ));
}
