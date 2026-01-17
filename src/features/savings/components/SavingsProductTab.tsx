import { useState } from 'react';
import { Assets, Border, ListHeader, ListRow, Spacing, Tab } from 'tosslib';
import { Suspense, ErrorBoundary } from '@suspensive/react';
import { SuspenseQuery } from '@suspensive/react-query';
import { savingsProductQuery } from 'features/savings/apis/queries';
import { calculateExpectedAmount, calculateRecommendedMonthlyPayment } from 'features/savings/utils/calculate';
import { SavingProductItem } from 'features/savings/components/SavingProductItem';
import { SavingsResultItem } from 'features/savings/components/SavingsResultItem';
import { SavingsProduct } from 'features/savings/types';
import { EmptyMessage } from 'shared/components/EmptyMessage';
import { useTab } from 'shared/hooks/useTab';

type SavingsTabProps = {
  targetAmount: number | null;
  monthlyPayment: number | null;
  terms: number | null;
};

export const SAVINGS_PRODUCT_TABS = {
  PRODUCTS: 'products',
  RESULTS: 'results',
};

const RECOMMENDED_PRODUCTS_COUNT = 2;

const descending =
  <T,>(getValue: (item: T) => number) =>
  (a: T, b: T) =>
    getValue(b) - getValue(a);

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

const filterByMonthlyPayment = (products: SavingsProduct[], monthlyPayment: number | null) =>
  monthlyPayment === null
    ? products
    : products.filter(
        product => monthlyPayment >= product.minMonthlyAmount && monthlyPayment <= product.maxMonthlyAmount
      );

const getRecommendedProducts = (products: SavingsProduct[], monthlyPayment: number | null) => {
  const filtered = filterByMonthlyPayment(products, monthlyPayment);
  return [...(filtered.length ? filtered : products)]
    .sort(descending(product => product.annualRate))
    .slice(0, RECOMMENDED_PRODUCTS_COUNT);
};

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
  return (
    <>
      {tab === SAVINGS_PRODUCT_TABS.PRODUCTS && (
        <SuspenseQuery
          {...savingsProductQuery.listQuery()}
          select={products => filterByMonthlyPayment(products, monthlyPayment)}
        >
          {({ data: filteredProducts }) =>
            filteredProducts.length > 0 ? (
              filteredProducts.map(product => {
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
                    right={selected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
                    onClick={() => onSelectProduct(product.id)}
                  />
                );
              })
            ) : (
              <EmptyMessage message="상품이 존재하지 않습니다." />
            )
          }
        </SuspenseQuery>
      )}

      <Spacing size={8} />

      {tab === SAVINGS_PRODUCT_TABS.RESULTS && (
        <>
          <SuspenseQuery
            {...savingsProductQuery.listQuery()}
            select={products => products.find(product => product.id === selectedProductId)}
          >
            {({ data: selectedProduct }) =>
              selectedProduct ? (
                <>
                  <SavingsResultItem
                    label="예상 수익 금액"
                    amount={calculateExpectedAmount({
                      annualRate: selectedProduct.annualRate,
                      monthlyPayment: monthlyPayment ?? 0,
                      terms: terms ?? 0,
                    })}
                  />
                  <SavingsResultItem
                    label="목표 금액과의 차이"
                    amount={
                      targetAmount
                        ? targetAmount -
                          calculateExpectedAmount({
                            annualRate: selectedProduct.annualRate,
                            monthlyPayment: monthlyPayment ?? 0,
                            terms: terms ?? 0,
                          })
                        : 0
                    }
                  />
                  <SavingsResultItem
                    label="추천 월 납입 금액"
                    amount={calculateRecommendedMonthlyPayment({
                      targetAmount: targetAmount ?? 0,
                      annualRate: selectedProduct.annualRate,
                      terms: terms ?? 0,
                    })}
                  />
                </>
              ) : (
                <EmptyMessage message="상품을 선택해주세요." />
              )
            }
          </SuspenseQuery>
          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />
          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />
          <SuspenseQuery
            {...savingsProductQuery.listQuery()}
            select={products => getRecommendedProducts(products, monthlyPayment)}
          >
            {({ data: recommendedProducts }) =>
              recommendedProducts.map(product => {
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
                    right={selected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
                    onClick={() => onSelectProduct(product.id)}
                  />
                );
              })
            }
          </SuspenseQuery>
          <Spacing size={40} />
        </>
      )}
    </>
  );
}
