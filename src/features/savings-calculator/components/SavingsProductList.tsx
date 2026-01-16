import { Assets, colors, ListRow } from 'tosslib';
import type { SavingsProduct } from 'shared/types';

interface SavingsProductListProps {
  products: SavingsProduct[];
  selectedProductId: string | null;
  onSelectProduct: (productId: string) => void;
}

export function SavingsProductList({ products, selectedProductId, onSelectProduct }: SavingsProductListProps) {
  // 숫자 포맷팅 함수 (formatNumber 인라인)
  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  return (
    <>
      {products.map(product => {
        const isSelected = selectedProductId === product.id;

        return (
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
            onClick={() => onSelectProduct(product.id)}
            right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
          />
        );
      })}
    </>
  );
}
