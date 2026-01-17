import { useState } from 'react';
import { Assets, Border, ListHeader, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { Suspense } from '@suspensive/react';
import { ErrorBoundary } from 'react-error-boundary';
import { SuspenseQuery } from '@suspensive/react-query';
import { savingsProductQuery } from 'features/savings/apis/queries';
import { calculateExpectedAmount, calculateRecommendedMonthlyPayment } from 'features/savings/utils/calculate';
import { SavingProductItem } from 'features/savings/components/SavingProductItem';
import { SavingsResultItem } from 'features/savings/components/SavingsResultItem';
import { SavingsProduct } from 'features/savings/types';
import { useTab } from 'shared/hooks/useTab';
import { NumberInput } from 'shared/components/NumberInput';
import { Select } from 'shared/components/Select';

const SAVINGS_PRODUCT_TABS = {
  PRODUCTS: 'products',
  RESULTS: 'results',
};

const RECOMMENDED_PRODUCTS_COUNT = 2;

const descending =
  <T,>(getValue: (item: T) => number) =>
  (a: T, b: T) =>
    getValue(b) - getValue(a);

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

export function SavingsCalculatorPage() {
  const { tab, handleTabChange } = useTab(SAVINGS_PRODUCT_TABS.PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [targetAmount, setTargetAmount] = useState<number | null>(null);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [terms, setTerms] = useState<number | null>(null);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <NumberInput
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount}
        onChange={setTargetAmount}
      />
      <Spacing size={16} />
      <NumberInput
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyPayment}
        onChange={setMonthlyPayment}
      />
      <Spacing size={16} />
      <Select
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={terms?.toString() ?? ''}
        options={[
          { value: '6', label: '6개월' },
          { value: '12', label: '12개월' },
          { value: '24', label: '24개월' },
        ]}
        onChange={value => setTerms(parseInt(value))}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={handleTabChange}>
        <Tab.Item value={SAVINGS_PRODUCT_TABS.PRODUCTS} selected={tab === SAVINGS_PRODUCT_TABS.PRODUCTS}>
          적금 상품
        </Tab.Item>
        <Tab.Item value={SAVINGS_PRODUCT_TABS.RESULTS} selected={tab === SAVINGS_PRODUCT_TABS.RESULTS}>
          계산 결과
        </Tab.Item>
      </Tab>

      <ErrorBoundary
        fallbackRender={() => <ListRow contents={<ListRow.Texts type="1RowTypeA" top="오류가 발생했습니다." />} />}
      >
        <Suspense fallback={<ListRow contents={<ListRow.Texts type="1RowTypeA" top="로딩 중..." />} />}>
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
                        onClick={() => setSelectedProductId(product.id)}
                      />
                    );
                  })
                ) : (
                  <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품이 존재하지 않습니다." />} />
                )
              }
            </SuspenseQuery>
          )}

          <Spacing size={8} />

          {tab === SAVINGS_PRODUCT_TABS.RESULTS && (
            <>
              <SuspenseQuery
                {...savingsProductQuery.listQuery()}
                select={products => {
                  const selectedProduct = products.find(product => product.id === selectedProductId);
                  if (!selectedProduct) {
                    return null;
                  }

                  const expectedAmount = calculateExpectedAmount({
                    annualRate: selectedProduct.annualRate,
                    monthlyPayment: monthlyPayment ?? 0,
                    terms: terms ?? 0,
                  });
                  const differenceAmount = targetAmount ? targetAmount - expectedAmount : 0;
                  const recommendedMonthlyPayment = calculateRecommendedMonthlyPayment({
                    targetAmount: targetAmount ?? 0,
                    annualRate: selectedProduct.annualRate,
                    terms: terms ?? 0,
                  });

                  return { expectedAmount, differenceAmount, recommendedMonthlyPayment };
                }}
              >
                {({ data: result }) =>
                  result ? (
                    <>
                      <SavingsResultItem label="예상 수익 금액" amount={result.expectedAmount} />
                      <SavingsResultItem label="목표 금액과의 차이" amount={result.differenceAmount} />
                      <SavingsResultItem label="추천 월 납입 금액" amount={result.recommendedMonthlyPayment} />
                    </>
                  ) : (
                    <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
                  )
                }
              </SuspenseQuery>
              <Spacing size={8} />
              <Border height={16} />
              <Spacing size={8} />
              <ListHeader
                title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
              />
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
                        onClick={() => setSelectedProductId(product.id)}
                      />
                    );
                  })
                }
              </SuspenseQuery>
              <Spacing size={40} />
            </>
          )}
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
