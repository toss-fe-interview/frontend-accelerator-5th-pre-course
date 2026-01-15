import { ListRow, Assets, colors } from 'tosslib';
import { SavingsProduct } from '../types';

type ProductListProps = {
  products: SavingsProduct[];
  selectedProduct: SavingsProduct | null;
  onProductSelect: (product: SavingsProduct) => void;
};

export function ProductList({ products, selectedProduct, onProductSelect }: ProductListProps) {
  return (
    <>
      {products.map(product => {
        const { annualRate, minMonthlyAmount, maxMonthlyAmount, id, name, availableTerms } = product;
        const description = `${minMonthlyAmount.toLocaleString('ko-KR')}원 ~ ${maxMonthlyAmount.toLocaleString('ko-KR')}원 | ${availableTerms}개월`;

        return (
          <ListRow
            key={id}
            contents={
              <ListRow.Texts
                type="3RowTypeA"
                top={name}
                topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                middle={`연 이자율: ${annualRate}%`}
                middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                bottom={description}
                bottomProps={{ fontSize: 13, color: colors.grey600 }}
              />
            }
            right={selectedProduct?.id === id && <Assets.Icon name="icon-check-circle-green" />}
            onClick={() => onProductSelect(product)}
          />
        );
      })}
    </>
  );
}
