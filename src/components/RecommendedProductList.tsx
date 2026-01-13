import { Border, colors, ListRow, Spacing, ListHeader, Assets } from 'tosslib';
import { SavingsProduct } from 'types/savings';
import { formatCurrency } from 'utils/format';

export function RecommendedProductList({
  recommendedProductList,
  selectedProduct,
  setSelectedProduct,
}: {
  recommendedProductList: SavingsProduct[];
  selectedProduct: SavingsProduct | null;
  setSelectedProduct: (product: SavingsProduct) => void;
}) {
  return (
    <>
      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      {recommendedProductList.map(product => (
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
          onClick={() => setSelectedProduct(product)}
        />
      ))}

      <Spacing size={40} />
    </>
  );
}
