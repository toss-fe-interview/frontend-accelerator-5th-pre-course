import SavingsGoalForm from 'features/calculate-savings/ui/SavingsGoalForm';
import { Border, NavigationBar, Spacing, Tab } from 'tosslib';
import { useSavingsCalculator } from './model/useSavingsCalculator';
import { DEFAULT_TERM_MONTHS, TAB_VALUES, TabValue } from './model/constants';
import ProductsTab from './ui/ProductsTab';
import ResultTab from './ui/ResultTab';
import { useFilteredProducts } from './model/useFilteredProducts';

export function SavingsCalculatorPage() {
  const { activeTab, selectedProduct, filter, updateFilter, selectProduct, changeTab } = useSavingsCalculator();
  const { products, recommendedProducts, isLoading, error } = useFilteredProducts(filter);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsGoalForm defaultValues={{ term: DEFAULT_TERM_MONTHS }} onChange={updateFilter} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => changeTab(value as TabValue)}>
        <Tab.Item value={TAB_VALUES.PRODUCTS} selected={activeTab === TAB_VALUES.PRODUCTS}>
          적금 상품
        </Tab.Item>
        <Tab.Item value={TAB_VALUES.RESULTS} selected={activeTab === TAB_VALUES.RESULTS}>
          계산 결과
        </Tab.Item>
      </Tab>

      {activeTab === TAB_VALUES.PRODUCTS && (
        <ProductsTab
          products={products}
          selectedProduct={selectedProduct}
          onSelectProduct={selectProduct}
          isLoading={isLoading}
          error={error}
        />
      )}
      {activeTab === TAB_VALUES.RESULTS && (
        <ResultTab
          selectedProduct={selectedProduct}
          targetAmount={filter.targetAmount}
          monthlyAmount={filter.monthlyAmount}
          term={filter.term}
          recommendedProducts={recommendedProducts}
          isLoading={isLoading}
          error={error}
        />
      )}
    </>
  );
}
