import { Border, NavigationBar, Spacing, Tab } from 'tosslib';
import SavingCalculatorInput from './components/SavingCalculatorInput';
import SavingProductList from './components/SavingItemList';
import SavingResult from './components/SavingResult';
import { Suspense, useState } from 'react';
import { SavingsProduct } from './api';
import { useCalculatorInputs } from './hooks/useCalculatorInputs';
import { useSavingsProducts } from './hooks/useSavingsProducts';

type SelectedTab = 'products' | 'results';

function SavingsCalculator() {
  const [selectedTab, setSelectedTab] = useState<SelectedTab>('products');
  const { calculInputs, setCalculInputs, deferredInputs } = useCalculatorInputs();
  const { filteredProducts, recommendedProducts } = useSavingsProducts(deferredInputs);

  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <SavingCalculatorInput calculInputs={calculInputs} onChange={setCalculInputs} />
      <Border height={16} />
      <Spacing size={8} />
      <Tab onChange={value => setSelectedTab(value as SelectedTab)}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>
      {selectedTab === 'products' && (
        <SavingProductList
          products={filteredProducts}
          selectedProduct={selectedProduct}
          onProductSelect={setSelectedProduct}
        />
      )}
      {selectedTab === 'results' && (
        <SavingResult
          selectedProduct={selectedProduct}
          calculInputs={calculInputs}
          recommendedProducts={recommendedProducts}
        />
      )}
    </>
  );
}

function SavingsCalculatorLoading() {
  return (
    <div>
      <p>적금 목록 불러오는중입니다...</p>
    </div>
  );
}

export function SavingsCalculatorPage() {
  return (
    <Suspense fallback={<SavingsCalculatorLoading />}>
      <SavingsCalculator />
    </Suspense>
  );
}
