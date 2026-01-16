import { SuspenseQuery } from '@suspensive/react-query';
import { SavingsProduct } from 'entities/savings-product/model/types';
import SavingsProductItem from 'entities/savings-product/ui/SavingsProductItem';
import { SavingsGoalFormData } from 'features/calculate-savings/model/types';
import CalculationResult from 'features/calculate-savings/ui/CalculationResult';
import SavingsGoalForm from 'features/calculate-savings/ui/SavingsGoalForm';
import RecommendedProducts from 'features/recommend-products/ui/RecommendedProducts';
import { savingsProductsQueryOptions } from 'features/savings-product/api/useSavingsProducts';
import { useState } from 'react';
import { descending, inRange, isEqual } from 'shared/lib/compare';
import AsyncBoundary from 'shared/ui/AsyncBoundary';
import { Border, NavigationBar, Spacing, Tab } from 'tosslib';
import { DEFAULT_TERM_MONTHS, RECOMMENDED_PRODUCTS_COUNT, TAB_VALUES, TabValue } from './model/constants';

export function SavingsCalculatorPage() {
  const [activeTab, setActiveTab] = useState<TabValue>(TAB_VALUES.PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);
  const [filter, setFilter] = useState<SavingsGoalFormData>({
    targetAmount: 0,
    monthlyAmount: 0,
    term: DEFAULT_TERM_MONTHS,
  });

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsGoalForm defaultValues={{ term: DEFAULT_TERM_MONTHS }} onChange={setFilter} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setActiveTab(value as TabValue)}>
        <Tab.Item value={TAB_VALUES.PRODUCTS} selected={activeTab === TAB_VALUES.PRODUCTS}>
          적금 상품
        </Tab.Item>
        <Tab.Item value={TAB_VALUES.RESULTS} selected={activeTab === TAB_VALUES.RESULTS}>
          계산 결과
        </Tab.Item>
      </Tab>

      <AsyncBoundary loadingMessage="불러오는 중입니다..." errorMessage="오류가 발생했습니다.">
        <SuspenseQuery {...savingsProductsQueryOptions()}>
          {({ data: allProducts }) => {
            const products =
              filter.monthlyAmount > 0
                ? allProducts
                    .filter(product =>
                      inRange({
                        value: filter.monthlyAmount,
                        min: product.minMonthlyAmount,
                        max: product.maxMonthlyAmount,
                      })
                    )
                    .filter(product => isEqual(product.availableTerms, filter.term))
                : allProducts;

            const recommendedProducts = selectedProduct
              ? [...products]
                  .sort((a, b) => descending(a.annualRate, b.annualRate))
                  .slice(0, RECOMMENDED_PRODUCTS_COUNT)
              : [];

            return (
              <>
                {activeTab === TAB_VALUES.PRODUCTS &&
                  products.map(product => (
                    <SavingsProductItem
                      key={product.id}
                      product={product}
                      selected={selectedProduct?.id === product.id}
                      onClick={() => setSelectedProduct(product)}
                    />
                  ))}

                {activeTab === TAB_VALUES.RESULTS && (
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
          }}
        </SuspenseQuery>
      </AsyncBoundary>
    </>
  );
}
