import { useState } from 'react';
import { Border, NavigationBar, Spacing, Tab } from 'tosslib';
import { CalculationResult, SavingsForm, SavingsProductList, useSavingsCalculator } from 'features/savings-calculator';
import { useSavingsProducts } from 'shared/hooks';
import { SavingsFormState } from 'shared/types';

export const DEFAULT_SAVINGS_FORM_STATE: SavingsFormState = {
  goalAmount: null,
  monthlyAmount: null,
  term: 12,
};

const TAB_VALUES = {
  SAVINGS_PRODUCTS: 'savingsProducts',
  CALCULATED_RESULT: 'calculatedResult',
} as const;

type TabValue = (typeof TAB_VALUES)[keyof typeof TAB_VALUES];

export function SavingsCalculatorPage() {
  const { data: products = [] } = useSavingsProducts();
  const [formState, setFormState] = useState<SavingsFormState>(DEFAULT_SAVINGS_FORM_STATE);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabValue>(TAB_VALUES.SAVINGS_PRODUCTS);

  const { filteredProducts, selectedProduct, recommendedProducts } = useSavingsCalculator({
    products,
    formState,
    selectedProductId,
  });

  const handleFormChange = (updates: Partial<SavingsFormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsForm formState={formState} onChange={handleFormChange} />

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
          products={filteredProducts}
          selectedProductId={selectedProductId}
          onSelectProduct={handleSelectProduct}
        />
      )}

      {selectedTab === TAB_VALUES.CALCULATED_RESULT && (
        <CalculationResult
          formState={formState}
          selectedProduct={selectedProduct}
          selectedProductId={selectedProductId}
          recommendedProducts={recommendedProducts}
        />
      )}
    </>
  );
}
