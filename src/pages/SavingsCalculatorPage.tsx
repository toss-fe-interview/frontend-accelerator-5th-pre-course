import { Suspense, useState } from 'react';
import { Border, NavigationBar, Spacing } from 'tosslib';
import { useSavingsCalculatorForm } from 'features/savings-calculator/model/useSavingsCalculatorForm';
import type { SavingsProduct } from 'features/savings-calculator/api/savings';
import { Tabs } from 'shared/ui/Tabs';
import { SavingsCalculatorForm, SavingsCalculatorResults, SavingsProductList } from 'features/savings-calculator';

export function SavingsCalculatorPage() {
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | undefined>(undefined);
  const form = useSavingsCalculatorForm();
  const { targetAmount, monthlyAmount, availableTerms } = form.watch();

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />
      <SavingsCalculatorForm control={form.control} />
      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />
      <Tabs
        defaultValue="products"
        items={[
          { value: 'products', label: '적금 상품' },
          { value: 'results', label: '계산 결과' },
        ]}
      >
        <Tabs.List />
        <Tabs.Content value="products">
          <Suspense>
            <SavingsProductList
              monthlyAmount={monthlyAmount}
              availableTerms={availableTerms}
              selectedProductId={selectedProduct?.id}
              onSelectedProduct={setSelectedProduct}
            />
          </Suspense>
        </Tabs.Content>
        <Tabs.Content value="results">
          <Suspense>
            <SavingsCalculatorResults
              targetAmount={targetAmount}
              monthlyAmount={monthlyAmount}
              availableTerms={availableTerms}
              selectedProduct={selectedProduct}
            />
          </Suspense>
        </Tabs.Content>
      </Tabs>
    </>
  );
}
