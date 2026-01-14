import { Border, NavigationBar, Spacing, Tab } from 'tosslib';
import SavingCalculatorInput from './components/SavingCalculatorInput';
import SavingItemList from './components/SavingItemList';
import SavingResult from './components/SavingResult';
import { Suspense, useDeferredValue, useMemo, useState } from 'react';
import { useGetSavingsProducts } from './api';

type SelectedTab = 'products' | 'results';

export interface CalculInputs {
  targetAmount: number;
  monthlyAmount: number;
  term: number;
}

function SavingsCalculator() {
  const [selectedTab, setSelectedTab] = useState<SelectedTab>('products');
  const [calculInputs, setCalculInputs] = useState<CalculInputs>({
    targetAmount: 0,
    monthlyAmount: 0,
    term: 0,
  });

  const { data: savingsProducts } = useGetSavingsProducts();
  const deferredInputs = useDeferredValue(calculInputs);

  const filteredProducts = useMemo(() => {
    // 입력값이 설정되지 않은 경우 전체 상품 표시
    if (deferredInputs.monthlyAmount === 0 && deferredInputs.term === 0) {
      return savingsProducts;
    }

    return savingsProducts.filter(product => {
      const monthlyAmountMatch =
        deferredInputs.monthlyAmount === 0 ||
        (deferredInputs.monthlyAmount > product.minMonthlyAmount &&
          deferredInputs.monthlyAmount < product.maxMonthlyAmount);

      const termMatch = deferredInputs.term === 0 || product.availableTerms === deferredInputs.term;

      return monthlyAmountMatch && termMatch;
    });
  }, [deferredInputs, savingsProducts]);

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
      {selectedTab === 'products' && <SavingItemList products={filteredProducts} />}
      {selectedTab === 'results' && <SavingResult />}
      <SavingResult />
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
