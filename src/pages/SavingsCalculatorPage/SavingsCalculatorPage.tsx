import { Border, NavigationBar, Spacing, Tab } from 'tosslib';
import { SavingsProduct } from './types/types';
import { useState } from 'react';
import { SavingsInputForm } from './components/form/SavingsInputForm';
import { useSavingsProducts } from './hooks/useSavingsProducts';
import { useFilteredSavingsProducts } from './hooks/useFilteredSavingsProducts';
import { useRecommendedProducts } from './hooks/useRecommendedProducts';
import { SavingsProductList } from './components/tab/SavingsProductList';
import { SavingsCalculationResult } from './components/tab/SavingsCalculationResult';

export function SavingsCalculatorPage() {
  const [savingsInput, setSavingsInput] = useState({
    targetAmount: '',
    monthlyAmount: '',
    savingsTerm: 12,
  });
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);
  const [savingsProductTab, setSavingsProductTab] = useState<'products' | 'results'>('products');

  const savingsProducts = useSavingsProducts();
  const filteredSavingsProducts = useFilteredSavingsProducts(savingsProducts, savingsInput);
  const recommendedProducts = useRecommendedProducts(filteredSavingsProducts, savingsInput);

  const handleSavingsInputChange = (key: keyof typeof savingsInput, value: string | number) => {
    setSavingsInput({ ...savingsInput, [key]: value });
  };

  const handleSelectSavingsProduct = (product: SavingsProduct) => {
    setSelectedSavingsProduct(product);
  };

  const handleSelectSavingsProductTab = (tab: 'products' | 'results') => {
    setSavingsProductTab(tab);
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsInputForm savingsInput={savingsInput} handleSavingsInputChange={handleSavingsInputChange} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => handleSelectSavingsProductTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={savingsProductTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={savingsProductTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {savingsProductTab === 'products' && (
        <SavingsProductList
          savingsProducts={savingsProducts}
          selectedSavingsProduct={selectedSavingsProduct}
          handleSelectSavingsProduct={handleSelectSavingsProduct}
        />
      )}

      {savingsProductTab === 'results' && (
        <SavingsCalculationResult
          selectedSavingsProduct={selectedSavingsProduct}
          savingsInput={savingsInput}
          recommendedProducts={recommendedProducts}
        />
      )}
    </>
  );
}
