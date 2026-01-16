import { Suspense, useState } from 'react';
import { Border, ListHeader, ListRow, Spacing, Tab } from 'tosslib';
import { useSuspenseQuery } from '@tanstack/react-query';
import { SAVINGS_PRODUCT_TABS } from 'features/savings/constants';
import { savingsProductQuery } from 'features/savings/apis/queries';
import { calculateExpectedAmount, calculateRecommendedMonthlyPayment } from 'features/savings/utils/calculate';
import { SavingProductItem } from 'features/savings/components/SavingProductItem';
import { SavingsResultItem } from 'features/savings/components/SavingsResultItem';
import { GreenCheckCircleIcon } from 'shared/icons/GreenCheckCircleIcon';
import { EmptyMessage } from 'shared/components/EmptyMessage';
import { ErrorBoundary } from 'shared/components/ErrorBoundary';
import { useTab } from 'shared/hooks/useTab';

type SavingsTabProps = {
  targetAmount: number | null;
  monthlyPayment: number | null;
  terms: number | null;
};

export function SavingsProductTab({ targetAmount, monthlyPayment, terms }: SavingsTabProps) {
  const { tab, handleTabChange } = useTab(SAVINGS_PRODUCT_TABS.PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  return (
    <>
      <Tab onChange={handleTabChange}>
        <Tab.Item value={SAVINGS_PRODUCT_TABS.PRODUCTS} selected={tab === SAVINGS_PRODUCT_TABS.PRODUCTS}>
          적금 상품
        </Tab.Item>
        <Tab.Item value={SAVINGS_PRODUCT_TABS.RESULTS} selected={tab === SAVINGS_PRODUCT_TABS.RESULTS}>
          계산 결과
        </Tab.Item>
      </Tab>

      <ErrorBoundary fallback={<EmptyMessage message="오류가 발생했습니다." />}>
        <Suspense fallback={<EmptyMessage message="로딩 중..." />}>
          <SavingsTabContent
            tab={tab}
            selectedProductId={selectedProductId}
            onSelectProduct={setSelectedProductId}
            targetAmount={targetAmount}
            monthlyPayment={monthlyPayment}
            terms={terms}
          />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

type SavingsTabContentProps = {
  tab: string;
  selectedProductId: string | null;
  onSelectProduct: (id: string) => void;
  targetAmount: number | null;
  monthlyPayment: number | null;
  terms: number | null;
};

function SavingsTabContent({
  tab,
  selectedProductId,
  onSelectProduct,
  targetAmount,
  monthlyPayment,
  terms,
}: SavingsTabContentProps) {
  const { data: savingsProducts } = useSuspenseQuery(savingsProductQuery.listQuery());

  const filteredSavingsProducts =
    monthlyPayment === null
      ? savingsProducts
      : savingsProducts.filter(
          product => monthlyPayment >= product.minMonthlyAmount && monthlyPayment <= product.maxMonthlyAmount
        );
  const recommendedProducts = [...(filteredSavingsProducts.length ? filteredSavingsProducts : savingsProducts)]
    .sort((a, b) => b.annualRate - a.annualRate)
    .slice(0, 2);
  const selectedSavingsProduct = savingsProducts.find(product => product.id === selectedProductId);

  const expectedAmount = calculateExpectedAmount({
    annualRate: selectedSavingsProduct?.annualRate ?? 0,
    monthlyPayment: monthlyPayment ?? 0,
    terms: terms ?? 0,
  });
  const differenceAmount = targetAmount ? targetAmount - expectedAmount : 0;
  const recommendedMonthlyPayment = calculateRecommendedMonthlyPayment({
    targetAmount: targetAmount ?? 0,
    annualRate: selectedSavingsProduct?.annualRate ?? 0,
    terms: terms ?? 0,
  });

  const showProductList = filteredSavingsProducts.length > 0;
  const showCalculationResults = selectedSavingsProduct !== undefined;

  return (
    <>
      {tab === SAVINGS_PRODUCT_TABS.PRODUCTS && (
        <>
          {showProductList ? (
            filteredSavingsProducts.map(product => {
              const selected = selectedProductId === product.id;
              return (
                <ListRow
                  key={product.id}
                  contents={
                    <SavingProductItem
                      name={product.name}
                      annualRate={product.annualRate}
                      minMonthlyAmount={product.minMonthlyAmount}
                      maxMonthlyAmount={product.maxMonthlyAmount}
                      availableTerms={product.availableTerms}
                    />
                  }
                  right={selected ? <GreenCheckCircleIcon /> : undefined}
                  onClick={() => onSelectProduct(product.id)}
                />
              );
            })
          ) : (
            <EmptyMessage message="상품이 존재하지 않습니다." />
          )}
        </>
      )}

      <Spacing size={8} />

      {tab === SAVINGS_PRODUCT_TABS.RESULTS && (
        <>
          {showCalculationResults ? (
            <>
              <SavingsResultItem label="예상 수익 금액" amount={expectedAmount} />
              <SavingsResultItem label="목표 금액과의 차이" amount={differenceAmount} />
              <SavingsResultItem label="추천 월 납입 금액" amount={recommendedMonthlyPayment} />
            </>
          ) : (
            <EmptyMessage message="상품을 선택해주세요." />
          )}
          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />
          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />
          {recommendedProducts.map(product => {
            const selected = selectedProductId === product.id;
            return (
              <ListRow
                key={product.id}
                contents={
                  <SavingProductItem
                    name={product.name}
                    annualRate={product.annualRate}
                    minMonthlyAmount={product.minMonthlyAmount}
                    maxMonthlyAmount={product.maxMonthlyAmount}
                    availableTerms={product.availableTerms}
                  />
                }
                right={selected ? <GreenCheckCircleIcon /> : undefined}
                onClick={() => onSelectProduct(product.id)}
              />
            );
          })}
          <Spacing size={40} />
        </>
      )}
    </>
  );
}
