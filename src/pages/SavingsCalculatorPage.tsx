import { useState } from 'react';
import { Border, ListHeader, NavigationBar, Spacing, Tab } from 'tosslib';
import { useSavingsProducts } from 'hooks/queries';
import { useCalculationResult } from 'hooks/useCalculationResult';
import { InputSection, ProductList, CalculationResultSection, InputValues } from 'components/savings';
import { PageStatus } from 'components/common/PageStatus';

const TAB_VALUES = {
  PRODUCTS: 'products',
  RESULTS: 'results',
} as const;

type TabValue = (typeof TAB_VALUES)[keyof typeof TAB_VALUES];

export function SavingsCalculatorPage() {
  const { products, isLoading, error } = useSavingsProducts();
  const [inputValues, setInputValues] = useState<InputValues>({
    targetAmount: '',
    monthlyDeposit: '',
    term: 12,
  });
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>(TAB_VALUES.PRODUCTS);

  const handleInputChange = (partial: Partial<InputValues>) => {
    setInputValues(prev => ({ ...prev, ...partial }));
  };

  const depositAmount = Number(inputValues.monthlyDeposit.replace(/,/g, '')) || 0;
  const filteredProducts = products.filter(product => {
    const termMatch = product.availableTerms === inputValues.term;
    const depositMatch =
      depositAmount === 0 || (depositAmount > product.minMonthlyAmount && depositAmount < product.maxMonthlyAmount);
    return termMatch && depositMatch;
  });

  const selectedProduct = products.find(product => product.id === selectedProductId) ?? null;
  const recommendedProducts = [...filteredProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  const calculationResult = useCalculationResult({
    selectedProduct,
    monthlyDeposit: inputValues.monthlyDeposit,
    targetAmount: inputValues.targetAmount,
    term: inputValues.term,
  });

  if (isLoading) {
    return <PageStatus title="적금 계산기" message="로딩 중..." />;
  }

  if (error) {
    return <PageStatus title="적금 계산기" message="상품을 불러올 수 없어요" />;
  }

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <InputSection values={inputValues} onChange={handleInputChange} />

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
          emptyMessage="조회 결과가 없어요"
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
            emptyMessage="추천 상품이 없어요"
          />

          <Spacing size={40} />
        </>
      )}
    </>
  );
}
