import CalculatorForm from 'component/CalculatorForm';
import ProductsPanel from 'component/ProductsPanel';
import ResultsPanel from 'component/ResultsPanel';
import Tabs from 'component/Tabs';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Border, NavigationBar, Spacing } from 'tosslib';
import { TabValue } from 'types/calculator';

export function SavingsCalculatorPage() {
  // 폼 상태
  const methods = useForm({
    defaultValues: {
      targetAmount: '',
      monthlyAmount: '',
      savingPeriod: 12,
    },
  });

  // UI 상태
  const [selectedTab, setSelectedTab] = useState<TabValue>('products');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  return (
    <FormProvider {...methods}>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      {/* 폼 입력 영역 */}
      <CalculatorForm />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      {/* 탭 */}
      <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      {/* 적금 상품 탭 */}
      {selectedTab === 'products' && (
        <ProductsPanel selectedProductId={selectedProductId} setSelectedProductId={setSelectedProductId} />
      )}

      {/* 계산 결과 탭 */}
      {selectedTab === 'results' && (
        <ResultsPanel selectedProductId={selectedProductId} setSelectedProductId={setSelectedProductId} />
      )}
    </FormProvider>
  );
}
