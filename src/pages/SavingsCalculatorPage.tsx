import { useState } from 'react';
import { Border, ListHeader, NavigationBar, Spacing, Tab } from 'tosslib';
import { useSavingsProducts } from 'hooks/queries';
import { useCalculationResult } from 'hooks/useCalculationResult';
import { InputSection, ProductList, CalculationResultSection } from 'components/savings';

const TAB_VALUES = {
  PRODUCTS: 'products',
  RESULTS: 'results',
} as const;

type TabValue = (typeof TAB_VALUES)[keyof typeof TAB_VALUES];

export function SavingsCalculatorPage() {
  const { products } = useSavingsProducts();
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [monthlyDeposit, setMonthlyDeposit] = useState<string>('');
  const [term, setTerm] = useState<number>(12);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>(TAB_VALUES.PRODUCTS);

  const depositAmount = Number(monthlyDeposit.replace(/,/g, '')) || 0;
  const filteredProducts = products.filter(product => {
    const termMatch = product.availableTerms === term;
    const depositMatch =
      depositAmount === 0 || (depositAmount > product.minMonthlyAmount && depositAmount < product.maxMonthlyAmount);
    return termMatch && depositMatch;
  });

  const selectedProduct = products.find(product => product.id === selectedProductId) ?? null;
  const recommendedProducts = [...filteredProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  const calculationResult = useCalculationResult({
    selectedProduct,
    monthlyDeposit,
    targetAmount,
    term,
  });

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <InputSection
        targetAmount={targetAmount}
        monthlyDeposit={monthlyDeposit}
        term={term}
        onTargetAmountChange={setTargetAmount}
        onMonthlyDepositChange={setMonthlyDeposit}
        onTermChange={setTerm}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setActiveTab(value as TabValue)}>
        <Tab.Item value={TAB_VALUES.PRODUCTS} selected={activeTab === TAB_VALUES.PRODUCTS}>
          적금 상품
        </Tab.Item>
        <Tab.Item value={TAB_VALUES.RESULTS} selected={activeTab === TAB_VALUES.RESULTS}>
          계산 결과
        </Tab.Item>
      </Tab>

      {activeTab === TAB_VALUES.PRODUCTS && (
        <ProductList
          products={filteredProducts}
          selectedProductId={selectedProductId}
          onProductSelect={setSelectedProductId}
        />
      )}

      {activeTab === TAB_VALUES.RESULTS && (
        <>
          <CalculationResultSection result={calculationResult} />

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          <ProductList
            products={recommendedProducts}
            selectedProductId={selectedProductId}
            onProductSelect={setSelectedProductId}
          />

          <Spacing size={40} />
        </>
      )}
    </>
  );
}
