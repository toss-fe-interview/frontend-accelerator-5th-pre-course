import {
  CalculationResult,
  SavingsCalculatorInputs,
  useSavingsCalculator,
  useSavingsForm,
} from 'features/savings-calculator';
import { SavingsProductList } from 'features/savings-calculator/components/SavingsProductList';
import { useState } from 'react';
import { useSavingsProducts } from 'shared/hooks';
import { Border, NavigationBar, Spacing, Tab } from 'tosslib';

const TAB_VALUES = {
  SAVINGS_PRODUCTS: 'savingsProducts',
  CALCULATED_RESULT: 'calculatedResult',
} as const;

type TabValue = (typeof TAB_VALUES)[keyof typeof TAB_VALUES];

export function SavingsCalculatorPage() {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabValue>(TAB_VALUES.SAVINGS_PRODUCTS);
  const { data: products = [] } = useSavingsProducts();
  const { goalAmount, monthlyAmount, term, handleGoalAmountChange, handleMonthlyAmountChange, handleTermChange } =
    useSavingsForm();
  const { filteredProducts, selectedProduct, recommendedProducts, calculationResult } = useSavingsCalculator({
    products,
    goalAmount,
    monthlyAmount,
    term,
    selectedProductId,
  });

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsCalculatorInputs
        goalAmount={goalAmount}
        monthlyAmount={monthlyAmount}
        term={term}
        onGoalAmountChange={handleGoalAmountChange}
        onMonthlyAmountChange={handleMonthlyAmountChange}
        onTermChange={handleTermChange}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSelectedTab(value as TabValue)}>
        <Tab.Item value={TAB_VALUES.SAVINGS_PRODUCTS} selected={selectedTab === TAB_VALUES.SAVINGS_PRODUCTS}>
          적금 상품
        </Tab.Item>
        <Tab.Item value={TAB_VALUES.CALCULATED_RESULT} selected={selectedTab === TAB_VALUES.CALCULATED_RESULT}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === TAB_VALUES.SAVINGS_PRODUCTS && (
        <SavingsProductList
          filteredProducts={filteredProducts}
          selectedProductId={selectedProductId}
          onClickProduct={(id: string) => setSelectedProductId(id)}
        />
      )}
      {selectedTab === TAB_VALUES.CALCULATED_RESULT && (
        <CalculationResult
          selectedProduct={selectedProduct}
          calculationResult={calculationResult}
          recommendedProducts={recommendedProducts}
          selectedProductId={selectedProductId}
        />
      )}
    </>
  );
}
