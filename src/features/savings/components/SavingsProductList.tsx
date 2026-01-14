import { ListRow, colors, Assets } from 'tosslib';
import { SavingsProduct } from '../schemas/savingsProduct';
import { formatNumberWithComma } from '../utils/format/number';

interface SavingsProductListProps {
  savingsProducts: SavingsProduct[];
  selectedProductId: string | null;
  changeSelectedProduct: (newValue: string) => void;
}

export default function SavingsProductList({
  savingsProducts,
  selectedProductId,
  changeSelectedProduct,
}: SavingsProductListProps) {
  return (
    <>
      {savingsProducts.map(product => (
        <ListRow
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${product.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${formatNumberWithComma(product.minMonthlyAmount)}원 ~ ${formatNumberWithComma(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={product.id === selectedProductId ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
          onClick={() => {
            changeSelectedProduct(product.id);
          }}
        />
      ))}
    </>
  );
}
