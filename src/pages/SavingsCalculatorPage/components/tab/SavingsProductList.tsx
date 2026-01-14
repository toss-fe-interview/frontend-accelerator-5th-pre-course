import { SavingsProduct } from '../../types/types';
import { ListRow, colors, Assets } from 'tosslib';
import { formatCurrency } from '../../lib/formatCurrency';

export function SavingsProductList({
  savingsProducts,
  selectedSavingsProduct,
  handleSelectSavingsProduct,
}: {
  savingsProducts: SavingsProduct[];
  selectedSavingsProduct: SavingsProduct | null;
  handleSelectSavingsProduct: (product: SavingsProduct) => void;
}) {
  return (
    <>
      {savingsProducts.map(product => (
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
          right={selectedSavingsProduct?.id === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null}
          onClick={() => {
            if (selectedSavingsProduct?.id === product.id) {
              handleSelectSavingsProduct(null as any);
            } else {
              handleSelectSavingsProduct(product);
            }
          }}
        />
      ))}
    </>
  );
}
