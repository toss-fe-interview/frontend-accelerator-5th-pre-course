import { Border, NavigationBar, Spacing } from 'tosslib';
import { SavingsProduct } from './types/types';
import { useState } from 'react';
import { SavingsInputForm } from './components/form/SavingsInputForm';
import { SavingsProductTabView } from './components/tab/SavingsProductTabView';
import { useSavingsProducts } from './hooks/useSavingsProducts';
import { useFilteredSavingsProducts } from './hooks/useFilteredSavingsProducts';
import { useRecommendedProducts } from './hooks/useRecommendedProducts';

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
    //TODO : 하나임을 보장받을 수 있는 로직
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

      <SavingsProductTabView
        savingsProducts={filteredSavingsProducts}
        selectedSavingsProduct={selectedSavingsProduct}
        handleSelectSavingsProduct={handleSelectSavingsProduct}
        savingsProductTab={savingsProductTab}
        handleSelectSavingsProductTab={handleSelectSavingsProductTab}
        savingsInput={savingsInput}
        recommendedProducts={recommendedProducts}
      />
    </>
  );
}
