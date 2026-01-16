import { Assets, colors, ListRow } from 'tosslib';
import { ProductSelection } from 'types/calculator';
import { SavingsProduct } from 'hooks/useSavingsProducts';
import filterProducts from 'utils/filterProducts';
import { useFormContext } from 'react-hook-form';

interface RecommendedProductsListProps extends ProductSelection {
  products: SavingsProduct[] | undefined;
}

const RecommendedProductsList = ({
  products,
  selectedProductId,
  setSelectedProductId,
}: RecommendedProductsListProps) => {
  const { watch } = useFormContext();

  // 폼 값
  const monthlyAmount = Number(watch('monthlyAmount')) || 0;
  const savingPeriod = Number(watch('savingPeriod')) || 0;

  // 상품 필터링
  const filteredProducts = filterProducts(products, monthlyAmount, savingPeriod);

  // 추천 상품 (연 이자율 높은 순 2개)
  const recommendedProducts = filteredProducts?.sort((a, b) => b.annualRate - a.annualRate).slice(0, 2) ?? [];
  return (
    <>
      {recommendedProducts.map(item => (
        <ListRow
          key={item.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={item.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${item.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${item.minMonthlyAmount.toLocaleString()}원 ~ ${item.maxMonthlyAmount.toLocaleString()}원 | ${item.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={selectedProductId === item.id && <Assets.Icon name="icon-check-circle-green" />}
          onClick={() => setSelectedProductId(item.id)}
        />
      ))}
    </>
  );
};

export default RecommendedProductsList;
