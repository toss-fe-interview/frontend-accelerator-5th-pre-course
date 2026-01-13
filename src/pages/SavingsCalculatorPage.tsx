import { Suspense, useState } from 'react';
import { Border, NavigationBar, Spacing, Tab } from 'tosslib';
import { useSavingsCalculatorForm } from 'hooks/useSavingsCalculatorForm';
import type { SavingsProduct } from 'api/savings';
import { SavingsProductList } from 'components/SavingsProductList';
import { SavingsCalculatorForm } from 'components/SavingsCalculatorForm';
import { SavingsCalculatorResults } from 'components/SavingsCalculatorResults';

export function SavingsCalculatorPage() {
  const [tab, setTab] = useState<'products' | 'results'>('products');
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | undefined>(undefined);

  const form = useSavingsCalculatorForm();

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <SavingsCalculatorForm control={form.control} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={tab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={tab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {tab === 'products' && (
        <Suspense>
          <SavingsProductList
            monthlyAmount={form.watch('monthlyAmount')}
            availableTerms={form.watch('availableTerms')}
            selectedProductId={selectedProduct?.id}
            onSelectedProduct={setSelectedProduct}
          />
        </Suspense>
      )}
      {tab === 'results' && (
        <Suspense>
          <SavingsCalculatorResults {...form.watch()} selectedProduct={selectedProduct} />
        </Suspense>
      )}
    </>
  );
}
