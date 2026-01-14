import { useSelectedProductStore } from 'store/useSelectedProduct';
import { Assets, colors, ListRow } from 'tosslib';
import type { SavingsProduct } from 'types/savingsProducts';

interface ProductListTabProps {
  filteredProducts: SavingsProduct[];
  isLoading: boolean;
  isError: boolean;
}

const ProductListTab = ({ filteredProducts, isLoading, isError }: ProductListTabProps) => {
  const { selectedProduct, setSelectedProduct } = useSelectedProductStore();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  if (filteredProducts.length === 0) return <div>No data</div>;

  return (
    <>
      {filteredProducts.map(product => (
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
          right={selectedProduct?.id === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null}
          onClick={() => {
            if (selectedProduct?.id === product.id) {
              setSelectedProduct(null);
            } else {
              setSelectedProduct(product);
            }
          }}
        />
      ))}
    </>
  );
};

export default ProductListTab;
