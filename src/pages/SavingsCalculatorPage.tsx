import { useMemo, useState } from 'react';
import { Border, NavigationBar, Spacing, Tab } from 'tosslib';
import { CalculationResult, SavingsForm, SavingsProductList } from 'features/savings-calculator';
import { useSavingsProducts } from 'shared/hooks';
import { SavingsFormState } from 'shared/types';

export const DEFAULT_SAVINGS_FORM_STATE: SavingsFormState = {
  goalAmount: null,
  monthlyAmount: null,
  term: 12,
};

type TabValue = 'savingsProducts' | 'calculatedResult';

export function SavingsCalculatorPage() {
  const { data: products = [] } = useSavingsProducts();
  const [formState, setFormState] = useState<SavingsFormState>(DEFAULT_SAVINGS_FORM_STATE);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabValue>('savingsProducts');

  const filteredProducts = useMemo(() => {
    const { monthlyAmount, term } = formState;

    if (monthlyAmount === null) {
      return products;
    }

    return products.filter(
      product =>
        product.minMonthlyAmount < monthlyAmount &&
        monthlyAmount < product.maxMonthlyAmount &&
        product.availableTerms === term
    );
  }, [products, formState]);

  const handleFormChange = (updates: Partial<SavingsFormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
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
        <Tab.Item value="savingsProducts" selected={selectedTab === 'savingsProducts'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="calculatedResult" selected={selectedTab === 'calculatedResult'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === 'savingsProducts' && (
        <SavingsProductList
          products={filteredProducts}
          selectedProductId={selectedProductId}
          onSelectProduct={setSelectedProductId}
        />
      )}

      {selectedTab === 'calculatedResult' && (
        <CalculationResult
          formState={formState}
          selectedProduct={products.find(p => p.id === selectedProductId) ?? null}
          selectedProductId={selectedProductId}
          filteredProducts={filteredProducts}
        />
      )}
    </>
  );
}
