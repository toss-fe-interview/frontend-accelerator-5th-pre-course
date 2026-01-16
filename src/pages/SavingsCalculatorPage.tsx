import { useState } from 'react';
import { Border, ListHeader, NavigationBar, Spacing, Tab } from 'tosslib';
import { useSavingsProducts } from 'hooks/queries';
import { useSavingsProductOptions } from 'hooks/useSavingsProductOptions';
import { useSavingsGoalEstimate } from 'hooks/useSavingsGoalEstimate';
import { SelectableProductList, CalculationResultSection } from 'components/savings';
import { PageStatus } from 'components/common/PageStatus';
import { EmptyMessage } from 'components/common/EmptyMessage';
import { CurrencyInput } from 'components/common/CurrencyInput';
import { TermSelect } from 'components/common/TermSelect';

const TAB_VALUES = {
  PRODUCTS: 'products',
  RESULTS: 'results',
} as const;

type TabValue = (typeof TAB_VALUES)[keyof typeof TAB_VALUES];

interface InputValues {
  targetAmount: string;
  monthlyDeposit: string;
  term: number;
}

export function SavingsCalculatorPage() {
  const { products, isLoading, error } = useSavingsProducts();
  const [values, setValues] = useState<InputValues>({
    targetAmount: '',
    monthlyDeposit: '',
    term: 12,
  });
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>(TAB_VALUES.PRODUCTS);

  const handleChange = (partial: Partial<InputValues>) => {
    setValues(prev => ({ ...prev, ...partial }));
  };

  const { availableProducts, selectedProduct, recommendedProducts } = useSavingsProductOptions({
    products,
    monthlyDeposit: values.monthlyDeposit,
    term: values.term,
    selectedProductId,
  });

  const goalEstimate = useSavingsGoalEstimate({
    selectedProduct,
    monthlyDeposit: values.monthlyDeposit,
    targetAmount: values.targetAmount,
    term: values.term,
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

      <CurrencyInput label="목표 금액" field="targetAmount" value={values.targetAmount} onChange={handleChange} />
      <CurrencyInput label="월 납입액" field="monthlyDeposit" value={values.monthlyDeposit} onChange={handleChange} />
      <TermSelect label="저축 기간" value={values.term} onChange={handleChange} />

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

      {activeTab === TAB_VALUES.PRODUCTS &&
        (availableProducts.length === 0 ? (
          <EmptyMessage message="조회 결과가 없어요" />
        ) : (
          <SelectableProductList
            products={availableProducts}
            selectedProductId={selectedProductId}
            onProductSelect={setSelectedProductId}
          />
        ))}

      {activeTab === TAB_VALUES.RESULTS && (
        <>
          <CalculationResultSection estimate={goalEstimate} />

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          {recommendedProducts.length === 0 ? (
            <EmptyMessage message="추천 상품이 없어요" />
          ) : (
            <SelectableProductList
              products={recommendedProducts}
              selectedProductId={selectedProductId}
              onProductSelect={setSelectedProductId}
            />
          )}

          <Spacing size={40} />
        </>
      )}
    </>
  );
}
