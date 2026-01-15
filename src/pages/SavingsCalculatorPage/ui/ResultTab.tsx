import { SavingsProduct } from 'entities/savings-product/model/types';
import CalculationResult from 'features/calculate-savings/ui/CalculationResult';
import RecommendedProducts from 'features/recommend-products/ui/RecommendedProducts';
import { ListRow } from 'tosslib';

interface ResultTabProps {
  selectedProduct: SavingsProduct | null;
  targetAmount: number;
  monthlyAmount: number;
  term: number;
  recommendedProducts: SavingsProduct[];

  isLoading: boolean;
  error: unknown;
}
const ResultTab = ({
  selectedProduct,
  targetAmount,
  monthlyAmount,
  term,
  recommendedProducts,
  isLoading,
  error,
}: ResultTabProps) => {
  if (isLoading) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="계산 결과를 불러오는 중입니다..." />} />;
  }

  if (error) {
    return (
      <ListRow contents={<ListRow.Texts type="1RowTypeA" top="계산 결과를 불러오는 중에 오류가 발생했습니다." />} />
    );
  }
  return (
    <>
      <CalculationResult
        selectedProduct={selectedProduct}
        targetAmount={targetAmount}
        monthlyAmount={monthlyAmount}
        term={term}
      />
      <RecommendedProducts selectedProduct={selectedProduct} products={recommendedProducts} />
    </>
  );
};

export default ResultTab;
