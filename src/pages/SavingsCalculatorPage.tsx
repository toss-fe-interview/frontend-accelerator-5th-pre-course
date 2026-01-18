import { useState } from 'react';
import { Border, ListHeader, NavigationBar, Spacing, Tab } from 'tosslib';
import { useSavingsProducts } from 'hooks/queries';
import { useSavingsProductOptions } from 'hooks/useSavingsProductOptions';
import { useSavingsGoalEstimate } from 'hooks/useSavingsGoalEstimate';
import { SavingsProductRow, CalculationResultSection } from 'components/savings';
import { PageStatus } from 'components/common/PageStatus';
import { EmptyMessage } from 'components/common/EmptyMessage';
import { CurrencyInput } from 'components/common/CurrencyInput';
import { TermSelect } from 'components/common/TermSelect';

const TAB_VALUES = {
  PRODUCTS: 'products',
  RESULTS: 'results',
} as const;

type TabValue = (typeof TAB_VALUES)[keyof typeof TAB_VALUES];

export function SavingsCalculatorPage() {
  const { products, isLoading, error } = useSavingsProducts();
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyDeposit, setMonthlyDeposit] = useState('');
  const [term, setTerm] = useState(12);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>(TAB_VALUES.PRODUCTS);

  const { availableProducts, selectedProduct, recommendedProducts } = useSavingsProductOptions({
    products,
    monthlyDeposit,
    term,
    selectedProductId,
  });

  const goalEstimate = useSavingsGoalEstimate({
    selectedProduct,
    monthlyDeposit,
    targetAmount,
    term,
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

      <CurrencyInput label="목표 금액" value={targetAmount} onChange={setTargetAmount} />
      <CurrencyInput label="월 납입액" value={monthlyDeposit} onChange={setMonthlyDeposit} />
      <TermSelect label="저축 기간" value={term} onChange={setTerm} />

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
          availableProducts.map(product => (
            <SavingsProductRow
              key={product.id}
              product={product}
              isSelected={selectedProductId === product.id}
              onSelect={() => setSelectedProductId(product.id)}
            />
          ))
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
            recommendedProducts.map(product => (
              <SavingsProductRow
                key={product.id}
                product={product}
                isSelected={selectedProductId === product.id}
                onSelect={() => setSelectedProductId(product.id)}
              />
            ))
          )}

          <Spacing size={40} />
        </>
      )}
    </>
  );
}
