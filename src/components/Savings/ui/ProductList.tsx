import type { SavingsProduct } from '..';
import { ListRow, Assets, colors } from 'tosslib';
import { EmptyState } from '../EmptyState';

interface ProductListProps {
  list: SavingsProduct[];
  selectedProductId: string | null;
  onProductClick: (productId: string) => void;
  emptyMessage?: string;
}

export function ProductList({
  list,
  selectedProductId,
  onProductClick,
  emptyMessage = '상품이 존재하지 않습니다.',
}: ProductListProps) {
  if (list.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <>
      {list.map((product) => (
        <ListRow
          key={product.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${product.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${product.minMonthlyAmount.toLocaleString()}원 ~ ${product.maxMonthlyAmount.toLocaleString()}원 | ${product.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
          onClick={() => onProductClick(product.id)}
        />
      ))}
    </>
  );
}