import { useState } from 'react';
import { Border, ListHeader, NavigationBar, Spacing, Tab } from 'tosslib';

import { EmptyListItem } from 'shared/ui/EmptyListItem';

import { useSavingsProducts } from 'entities/savings/model/useSavingsProducts';
import { SavingsProductListItem } from 'entities/savings/ui/SavingsProductListItem';
import { SavingsProductListSection } from 'entities/savings/ui/SavingsProductListSection';

import { isAvailableProduct } from 'features/savings-calculator/lib/isAvailableProduct';
import { SavingsCalculatorFormState } from 'features/savings-calculator/model/types';
import { AmountInput } from 'features/savings-calculator/ui/input/AmountInput';
import { SavingsTermSelect } from 'features/savings-calculator/ui/input/SavingsTermSelect';
import { RecommendedProductSection } from 'features/savings-calculator/ui/recommendation/RecommendedProductSection';
import { CalculationResultItem } from 'features/savings-calculator/ui/result/CalculationResultItem';
import { CalculationResultSection } from 'features/savings-calculator/ui/result/CalculationResultSection';

export function SavingsCalculatorPage() {
  const { data: savingsProducts } = useSavingsProducts();
  const [formState, setFormState] = useState<SavingsCalculatorFormState>({
    targetAmount: 0,
    monthlyAmount: 0,
    term: 12,
  });
  const [selectedSavingsProductId, setSelectedSavingsProductId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'products' | 'results'>('products');

  const availableProducts = savingsProducts.filter(savingsProduct => isAvailableProduct({ savingsProduct, formState }));

  const selectedSavingsProduct = availableProducts.find(
    savingsProduct => savingsProduct.id === selectedSavingsProductId
  );

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <AmountInput
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={formState.targetAmount}
        onChange={value => setFormState({ ...formState, targetAmount: value })}
      />
      <Spacing size={16} />
      <AmountInput
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={formState.monthlyAmount}
        onChange={value => setFormState({ ...formState, monthlyAmount: value })}
      />
      <Spacing size={16} />
      <SavingsTermSelect
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={formState.term}
        onChange={value => setFormState({ ...formState, term: value })}
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

      {selectedTab === 'products' && (
        <SavingsProductListSection
          products={availableProducts}
          emptyFallback={<EmptyListItem message="적합한 적금 상품이 없습니다." />}
        >
          {products =>
            products.map(product => (
              <SavingsProductListItem
                key={product.id}
                savingsProduct={product}
                isSelected={selectedSavingsProductId === product.id}
                handleSelectSavingsProduct={p => setSelectedSavingsProductId(p?.id || null)}
              />
            ))
          }
        </SavingsProductListSection>
      )}

      {selectedTab === 'results' && (
        <>
          <Spacing size={8} />

          <CalculationResultSection
            product={selectedSavingsProduct || null}
            investment={{ monthlyAmount: formState.monthlyAmount, term: formState.term }}
            goal={{ targetAmount: formState.targetAmount }}
            emptyFallback={<EmptyListItem message="상품을 선택해주세요." />}
          >
            {({ finalAmount, differenceAmount, recommendedMonthlyAmount }) => (
              <>
                <CalculationResultItem label="예상 수익 금액" amount={finalAmount} />
                <CalculationResultItem label="목표 금액과의 차이" amount={differenceAmount} />
                <CalculationResultItem label="추천 월 납입 금액" amount={recommendedMonthlyAmount} />
              </>
            )}
          </CalculationResultSection>

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          <RecommendedProductSection
            candidateProducts={availableProducts}
            emptyFallback={<EmptyListItem message="적합한 추천 상품이 없습니다." />}
          >
            {recommendedProducts =>
              recommendedProducts.map(product => (
                <SavingsProductListItem
                  key={product.id}
                  savingsProduct={product}
                  isSelected={selectedSavingsProductId === product.id}
                  handleSelectSavingsProduct={p => setSelectedSavingsProductId(p?.id || null)}
                />
              ))
            }
          </RecommendedProductSection>

          <Spacing size={40} />
        </>
      )}
    </>
  );
}
