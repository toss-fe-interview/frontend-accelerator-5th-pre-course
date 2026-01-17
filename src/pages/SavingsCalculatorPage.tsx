import { ErrorBoundary, Suspense } from '@suspensive/react';
import { SuspenseQuery } from '@suspensive/react-query';
import { useState } from 'react';
import { Border, ListHeader, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';

import { CheckCircleIcon } from 'shared/ui/CheckCircleIcon';
import { EmptyListItem } from 'shared/ui/EmptyListItem';

import { savingsProductsQueryOptions } from 'entities/savings/model/savingsProductsQuery';
import { SavingsProductInfo } from 'entities/savings/ui/SavingsProductInfo';
import { SavingsProductListSection } from 'entities/savings/ui/SavingsProductListSection';

import { filterAvailableProducts } from 'features/savings-calculator/lib/filterAvailableProducts';
import { SavingsCondition } from 'features/savings-calculator/model/types';
import { AmountInput } from 'features/savings-calculator/ui/input/AmountInput';
import { SavingsTermSelect } from 'features/savings-calculator/ui/input/SavingsTermSelect';
import { RecommendedProductSection } from 'features/savings-calculator/ui/recommendation/RecommendedProductSection';
import { CalculationResultAmount } from 'features/savings-calculator/ui/result/CalculationResultAmount';
import { CalculationResultSection } from 'features/savings-calculator/ui/result/CalculationResultSection';

export function SavingsCalculatorPage() {
  const [condition, setCondition] = useState<SavingsCondition>({
    targetAmount: 0,
    monthlyAmount: 0,
    term: 12,
  });

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [selectedTab, setSelectedTab] = useState<'products' | 'results'>('products');

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <AmountInput
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={condition.targetAmount}
        onChange={(targetAmount: number) => {
          setCondition(prev => ({ ...prev, targetAmount }));
        }}
      />
      <Spacing size={16} />
      <AmountInput
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={condition.monthlyAmount}
        onChange={(monthlyAmount: number) => {
          setCondition(prev => ({ ...prev, monthlyAmount }));
        }}
      />
      <Spacing size={16} />
      <SavingsTermSelect
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={condition.term}
        onChange={(term: number) => {
          setCondition(prev => ({ ...prev, term }));
        }}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={tab => setSelectedTab(tab as 'products' | 'results')}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>
      <ErrorBoundary fallback={({ error }) => <>{error.message}</>}>
        <Suspense fallback={'loading'}>
          <SuspenseQuery {...savingsProductsQueryOptions} select={filterAvailableProducts(condition)}>
            {({ data: availableProducts }) => (
              <>
                {selectedTab === 'products' && (
                  <SavingsProductListSection
                    products={availableProducts}
                    emptyFallback={<EmptyListItem message="적합한 적금 상품이 없습니다." />}
                  >
                    {products =>
                      products.map(product => {
                        const isSelected = selectedProductId === product.id;
                        return (
                          <ListRow
                            key={product.id}
                            contents={<SavingsProductInfo product={product} />}
                            right={isSelected && <CheckCircleIcon />}
                            onClick={() => setSelectedProductId(isSelected ? null : product.id)}
                          />
                        );
                      })
                    }
                  </SavingsProductListSection>
                )}
                {selectedTab === 'results' && (
                  <>
                    <Spacing size={8} />

                    <CalculationResultSection
                      product={availableProducts.find(product => product.id === selectedProductId) ?? null}
                      targetAmount={condition.targetAmount}
                      monthlyAmount={condition.monthlyAmount}
                      term={condition.term}
                      emptyFallback={<EmptyListItem message="상품을 선택해주세요." />}
                    >
                      {({ finalAmount, differenceAmount, recommendedMonthlyAmount }) => (
                        <>
                          <ListRow contents={<CalculationResultAmount label="예상 수익 금액" amount={finalAmount} />} />
                          <ListRow
                            contents={<CalculationResultAmount label="목표 금액과의 차이" amount={differenceAmount} />}
                          />
                          <ListRow
                            contents={
                              <CalculationResultAmount label="추천 월 납입 금액" amount={recommendedMonthlyAmount} />
                            }
                          />
                        </>
                      )}
                    </CalculationResultSection>

                    <Spacing size={8} />
                    <Border height={16} />
                    <Spacing size={8} />

                    <ListHeader
                      title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
                    />
                    <Spacing size={12} />

                    <RecommendedProductSection
                      candidateProducts={availableProducts}
                      emptyFallback={<EmptyListItem message="적합한 추천 상품이 없습니다." />}
                    >
                      {recommendedProducts =>
                        recommendedProducts.map(product => {
                          const isSelected = selectedProductId === product.id;
                          return (
                            <ListRow
                              key={product.id}
                              contents={<SavingsProductInfo product={product} />}
                              right={isSelected && <CheckCircleIcon />}
                              onClick={() => setSelectedProductId(isSelected ? null : product.id)}
                            />
                          );
                        })
                      }
                    </RecommendedProductSection>

                    <Spacing size={40} />
                  </>
                )}
              </>
            )}
          </SuspenseQuery>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
