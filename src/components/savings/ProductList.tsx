import { Assets, colors, ListRow } from 'tosslib';
import { SavingsProduct } from 'hooks/queries/types';

interface ProductListProps {
  products: SavingsProduct[];
  selectedProductId: string | null;
  onProductSelect: (id: string) => void;
}

const formatNumber = (num: number) => num.toLocaleString('ko-KR');

export function ProductList({ products, selectedProductId, onProductSelect }: ProductListProps) {
  return (
    <>
      {products.map(product => (
        <ListRow
          key={product.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${product.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${formatNumber(product.minMonthlyAmount)}원 ~ ${formatNumber(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          onClick={() => onProductSelect(product.id)}
          right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
        />
      ))}
    </>
  );
}
