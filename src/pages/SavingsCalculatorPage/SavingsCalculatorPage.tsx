import { Border, NavigationBar, Spacing } from 'tosslib';
import { SavingsInputForm } from './components/SavingsInputForm';
import { SavingsProductTabView } from './components/SavingsProductTabView';
import { getSavingsProducts } from './api/getSavingsProducts';
import { SavingsProduct } from './types/types';
import { useEffect, useState } from 'react';

export function SavingsCalculatorPage() {
  const [savingsInput, setSavingsInput] = useState({
    targetAmount: '',
    monthlyAmount: '',
    savingsTerm: 12,
  });
  const [savingsProducts, setSavingsProducts] = useState<SavingsProduct[]>([]);
  const [filteredSavingsProducts, setFilteredSavingsProducts] = useState<SavingsProduct[]>([]);
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);
  const [savingsProductTab, setSavingsProductTab] = useState<'products' | 'results'>('products');
  // 2개의 상품만 추천하는 의미를 넣으면 좋을듯..
  const [recommendedProducts, setRecommendedProducts] = useState<SavingsProduct[]>([]);

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

  useEffect(() => {
    const fetchSavingsProducts = async () => {
      // TODO: 에러, 로딩 처리
      const response = await getSavingsProducts();
      if (response) {
        setSavingsProducts(response);
      }
    };

    fetchSavingsProducts();
  }, []);

  useEffect(() => {
    if (savingsProducts.length === 0) {
      return;
    }

    const monthlyAmountNumber = Number(savingsInput.monthlyAmount);
    const hasMonthlyAmount = savingsInput.monthlyAmount !== '' && !isNaN(monthlyAmountNumber);

    if (!hasMonthlyAmount) {
      setFilteredSavingsProducts(savingsProducts);
      return;
    }

    const filteredProducts = savingsProducts.filter(product => {
      const isMonthlyAmountValid =
        monthlyAmountNumber >= product.minMonthlyAmount && monthlyAmountNumber <= product.maxMonthlyAmount;
      const isTermMatched = product.availableTerms === savingsInput.savingsTerm;
      return isMonthlyAmountValid && isTermMatched;
    });

    setFilteredSavingsProducts(filteredProducts);
  }, [savingsProducts, savingsInput]);

  useEffect(() => {
    if (savingsInput.targetAmount !== '' && savingsInput.monthlyAmount !== '' && savingsInput.targetAmount) {
      // 연 이자율이 높은 순으로 정렬하고 상위 2개 선택
      const sortedByRate = [...filteredSavingsProducts].sort((a, b) => b.annualRate - a.annualRate);
      const topTwoProducts = sortedByRate.slice(0, 2);
      setRecommendedProducts(topTwoProducts);
    } else {
      setRecommendedProducts([]);
    }
  }, [filteredSavingsProducts, savingsInput]);

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
