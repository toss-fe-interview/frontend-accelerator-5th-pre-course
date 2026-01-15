import { Assets, Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { SavingsProduct } from 'api/product';
import { useProducts } from 'hook/useProducts';

interface RecommendedProductListProps {
  monthlyPayment: number;
  savingPeriod: number;
  selectedSavingsProduct: SavingsProduct | null;
  onSelectProduct: (product: SavingsProduct) => void;
}

export const recommendSavingsProducts = (savingsProducts: SavingsProduct[]) => {
  return savingsProducts.sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);
};

export function RecommendedProductList({
  monthlyPayment,
  savingPeriod,
  selectedSavingsProduct,
  onSelectProduct,
}: RecommendedProductListProps) {
  const { products } = useProducts({
    monthlyPayment,
    savingPeriod,
  });

  const recommendProducts = recommendSavingsProducts(products);

  return (
    <>
      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      {recommendProducts.map(product => (
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
      ))}

      <Spacing size={40} />
    </>
  );
}
