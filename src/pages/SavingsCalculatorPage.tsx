import { SavingsProduct } from 'entities/savings-product/model/types';
import SavingsProductItem from 'entities/savings-product/ui/SavingsProductItem';
import { SavingsGoalFormData } from 'features/calculate-savings/model/types';
import CalculationResult from 'features/calculate-savings/ui/CalculationResult';
import SavingsGoalForm from 'features/calculate-savings/ui/SavingsGoalForm';
import { getRecommendedProducts } from 'features/recommend-products/model/filter';
import RecommendedProducts from 'features/recommend-products/ui/RecommendedProducts';
import { useSavingsProducts } from 'features/savings-product/api/useSavingsProducts';
import { SavingsProductFilter } from 'features/savings-product/model/filters';
import { useCallback, useMemo, useState } from 'react';
import { Border, NavigationBar, Spacing, Tab } from 'tosslib';

type TabValue = 'products' | 'results';

export function SavingsCalculatorPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('products');
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);

  const [filter, setFilter] = useState<SavingsGoalFormData>({
    targetAmount: 0,
    monthlyAmount: 0,
    term: 12,
  });
  const memoizedFilter: SavingsProductFilter = useMemo(() => {
    return {
      targetAmount: filter.targetAmount,
      monthlyAmount: filter.monthlyAmount,
      term: filter.term,
    };
  }, [filter]);

  const { data: products } = useSavingsProducts(memoizedFilter);

  const recommendedProducts = useMemo(() => {
    if (filter.monthlyAmount <= 0) {
      return [];
    }
    return getRecommendedProducts(products, filter.monthlyAmount, filter.term).slice(0, 2);
  }, [products, filter.monthlyAmount, filter.term]);

  const handleSelectProduct = (product: SavingsProduct) => {
    setSelectedProduct(product);
  };

  const handleChangeFilter = useCallback((data: SavingsGoalFormData) => {
    setFilter(data);
  }, []);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsGoalForm onChange={handleChangeFilter} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setActiveTab(value as TabValue)}>
        <Tab.Item value="products" selected={activeTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={activeTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {activeTab === 'products' &&
        products?.map(product => (
          <SavingsProductItem
            key={product.id}
            product={product}
            selected={selectedProduct?.id === product.id}
            onClick={() => handleSelectProduct(product)}
          />
        ))}
      {activeTab === 'results' && (
        <>
          <CalculationResult
            selectedProduct={selectedProduct}
            targetAmount={filter.targetAmount}
            monthlyAmount={filter.monthlyAmount}
            term={filter.term}
          />
          <RecommendedProducts selectedProduct={selectedProduct} products={recommendedProducts} />
        </>
      )}
    </>
  );
}
