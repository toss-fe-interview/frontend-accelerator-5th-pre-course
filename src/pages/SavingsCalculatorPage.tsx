import map from 'lodash/fp/map';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Border, ListHeader, ListRow, NavigationBar, Spacing } from 'tosslib';

import { toggleQueryParam } from 'shared/lib/toggleQueryParam';
import { CheckCircleIcon } from 'shared/ui/CheckCircleIcon';
import { EmptyListItem } from 'shared/ui/EmptyListItem';
import { Tabs } from 'shared/ui/Tabs';

import { SavingsProductInfo } from 'entities/savings/ui/SavingsProductInfo';
import { SavingsProductListSection } from 'entities/savings/ui/SavingsProductListSection';

import { filterAvailableProducts } from 'features/savings-calculator/lib/filterAvailableProducts';
import { isSelectionReady } from 'features/savings-calculator/lib/savingsConditionValidators';
import { SavingsCondition } from 'features/savings-calculator/model/types';
import { SavingsProductDataBoundary } from 'features/savings-calculator/ui/boundary/SavingsProductDataBoundary';
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

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedProductId = searchParams.get('productId') ?? null;

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <AmountInput
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={condition.targetAmount}
        onChange={targetAmount => setCondition(prev => ({ ...prev, targetAmount }))}
      />
      <Spacing size={16} />
      <AmountInput
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={condition.monthlyAmount}
        onChange={monthlyAmount => setCondition(prev => ({ ...prev, monthlyAmount }))}
      />
      <Spacing size={16} />
      <SavingsTermSelect
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={condition.term}
        onChange={term => setCondition(prev => ({ ...prev, term }))}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tabs defaultValue="products">
        <Tabs.List>
          <Tabs.Tab value="products">적금 상품</Tabs.Tab>
          <Tabs.Tab value="results">계산 결과</Tabs.Tab>
        </Tabs.List>

        <SavingsProductDataBoundary
          select={isSelectionReady(condition) ? filterAvailableProducts(condition) : undefined}
        >
          {availableProducts => (
            <>
              <Tabs.Panel value="products">
                <SavingsProductListSection
                  products={availableProducts}
                  emptyFallback={<EmptyListItem message="적합한 적금 상품이 없습니다." />}
                >
                  {map(product => (
                    <ListRow
                      key={product.id}
                      contents={<SavingsProductInfo product={product} />}
                      right={selectedProductId === product.id && <CheckCircleIcon />}
                      onClick={() =>
                        setSearchParams(toggleQueryParam({ name: 'productId', value: product.id }), { replace: true })
                      }
                    />
                  ))}
                </SavingsProductListSection>
              </Tabs.Panel>
              <Tabs.Panel value="results">
                <Spacing size={8} />

                <CalculationResultSection
                  product={availableProducts.find(product => product.id === selectedProductId) ?? null}
                  condition={condition}
                  emptyFallback={
                    <EmptyListItem
                      message={
                        (condition.targetAmount <= 0 && '목표 금액을 입력해주세요.') ||
                        (condition.monthlyAmount <= 0 && '월 납입액을 입력해주세요.') ||
                        (condition.term <= 0 && '저축 기간을 선택해주세요.') ||
                        '상품을 선택해주세요.'
                      }
                    />
                  }
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
                  {map(product => (
                    <ListRow
                      key={product.id}
                      contents={<SavingsProductInfo product={product} />}
                      right={selectedProductId === product.id && <CheckCircleIcon />}
                      onClick={() =>
                        setSearchParams(toggleQueryParam({ name: 'productId', value: product.id }), { replace: true })
                      }
                    />
                  ))}
                </RecommendedProductSection>

                <Spacing size={40} />
              </Tabs.Panel>
            </>
          )}
        </SavingsProductDataBoundary>
      </Tabs>
    </>
  );
}
