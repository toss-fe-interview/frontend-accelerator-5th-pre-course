import { Assets, colors, ListRow } from 'tosslib';
import { SavingsProduct } from 'api/product';
import { useProducts } from 'hook/useProducts';

interface ProductsTabProps {
  monthlyPayment: number;
  savingPeriod: number;
  selectedSavingsProduct: SavingsProduct | null;
  onSelectProduct: (product: SavingsProduct) => void;
}

export function ProductsTab({
  monthlyPayment,
  savingPeriod,
  selectedSavingsProduct,
  onSelectProduct,
}: ProductsTabProps) {
  const { products } = useProducts({
    monthlyPayment,
    savingPeriod,
  });

  return (
    <>
      {products.length === 0 ? (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 찾을 수 없습니다." />} />
      ) : (
        products.map(product => (
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
            right={selectedSavingsProduct?.id === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null}
            onClick={() => {
              onSelectProduct(product);
            }}
          />
        ))
      )}
    </>
  );
}
