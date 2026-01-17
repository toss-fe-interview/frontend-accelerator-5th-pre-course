import { Border, ListHeader, NavigationBar, Spacing, Tab } from 'tosslib';
import { useState } from 'react';
import { getSavingsProducts, SavingsProduct } from 'pages/SavingCalculator/api/product';
import { SavingsProductListRow } from 'pages/SavingCalculator/ui/SavingsProductItem';
import { CalculationResultItem } from 'pages/SavingCalculator/ui/CalculationResultItem';
import { TermsSelect } from 'pages/SavingCalculator/ui/TermsSelect';
import { queryOptions } from '@tanstack/react-query';
import { roundToThousand } from 'shared/utils/number';
import { EmptyMessage } from 'shared/ui/EmptyMessage';
import { eq, gt, lt } from 'es-toolkit/compat';
import { SuspenseQuery } from '@suspensive/react-query';
import { NumberInput } from 'shared/ui/NumberField';
import { AsyncBoundary } from 'shared/ui/AsyncBoundary';
import { flow, orderBy, take } from 'es-toolkit';

const TOP_RECOMMENDATION_COUNT = 2;

type Tab = 'products' | 'results';

const savingsProductsQueyOptions = () =>
  queryOptions({
    queryKey: ['products'],
    queryFn: getSavingsProducts,
  });

export function SavingsCalculatorPage() {
  const [filters, setFilters] = useState({
    목표_금액: 0,
    월_납입액: 0,
    저축_기간: 12,
  });
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);
  const [tab, setTab] = useState<Tab>('products');

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <NumberInput
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        value={filters.목표_금액}
        onChange={value => setFilters(prev => ({ ...prev, 목표_금액: value }))}
      />
      <Spacing size={16} />
      <NumberInput
        label="월 납입액"
        placeholder="월 납입액을 입력하세요"
        value={filters.월_납입액}
        onChange={value => setFilters(prev => ({ ...prev, 월_납입액: value }))}
      />
      <Spacing size={16} />
      <TermsSelect
        title="저축 기간"
        value={filters.저축_기간}
        onSelect={value => setFilters(prev => ({ ...prev, 저축_기간: value }))}
        options={[
          { value: 6, label: '6개월' },
          { value: 12, label: '12개월' },
          { value: 24, label: '24개월' },
        ]}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab
        onChange={value => {
          setTab(value as Tab);
        }}
      >
        <Tab.Item value="products" selected={tab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={tab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {(() => {
        switch (tab) {
          case 'products':
            return (
              <AsyncBoundary>
                <SuspenseQuery
                  {...savingsProductsQueyOptions()}
                  select={products =>
                    products.filter(product => {
                      const isAboveMinMonthlyAmount = gt(product.minMonthlyAmount, filters.월_납입액);
                      const isBelowMaxMonthlyAmount = lt(product.maxMonthlyAmount, filters.월_납입액);
                      const isMatchingAvailableTerms = eq(product.availableTerms, filters.저축_기간);

                      return isAboveMinMonthlyAmount && isBelowMaxMonthlyAmount && isMatchingAvailableTerms;
                    })
                  }
                >
                  {({ data: products }) =>
                    products.map(product => {
                      const isSelected = selectedSavingsProduct?.id === product.id;
                      return (
                        <SavingsProductListRow
                          key={product.id}
                          product={product}
                          isSelected={isSelected}
                          onClick={() => setSelectedSavingsProduct(product)}
                        />
                      );
                    })
                  }
                </SuspenseQuery>
              </AsyncBoundary>
            );
          case 'results':
            return (
              <>
                <Spacing size={8} />

                {selectedSavingsProduct ? (
                  (() => {
                    const 이자율_승수 = 1 + selectedSavingsProduct.annualRate * 0.5;
                    const 총_납입_원금 = filters.월_납입액 * filters.저축_기간;

                    const 예상_수익_금액 = 총_납입_원금 * 이자율_승수;
                    const 목표_금액과의_차이 = filters.목표_금액 - 예상_수익_금액;
                    const 추천_월_납입_금액 = roundToThousand(filters.목표_금액 / (filters.저축_기간 * 이자율_승수));

                    return (
                      <>
                        <CalculationResultItem name="예상 수익 금액" amount={예상_수익_금액} />
                        <CalculationResultItem name="목표 금액과의 차이" amount={목표_금액과의_차이} />
                        <CalculationResultItem name="추천 월 납입 금액" amount={추천_월_납입_금액} />
                      </>
                    );
                  })()
                ) : (
                  <EmptyMessage message="상품을 선택해주세요." />
                )}

                <Spacing size={8} />
                <Border height={16} />
                <Spacing size={8} />

                <ListHeader
                  title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
                />
                <Spacing size={12} />

                <AsyncBoundary>
                  <SuspenseQuery
                    {...savingsProductsQueyOptions()}
                    select={products => {
                      const getRecommendedProducts = flow(
                        (products: SavingsProduct[]) =>
                          products.filter(product => {
                            const isAboveMinMonthlyAmount = gt(product.minMonthlyAmount, filters.월_납입액);
                            const isBelowMaxMonthlyAmount = lt(product.maxMonthlyAmount, filters.월_납입액);
                            const isMatchingAvailableTerms = eq(product.availableTerms, filters.저축_기간);

                            return isAboveMinMonthlyAmount && isBelowMaxMonthlyAmount && isMatchingAvailableTerms;
                          }),
                        (products: SavingsProduct[]) => orderBy(products, ['annualRate'], ['desc']),
                        (products: SavingsProduct[]) => take(products, TOP_RECOMMENDATION_COUNT)
                      );

                      return getRecommendedProducts(products);
                    }}
                  >
                    {({ data: products }) =>
                      products.map(product => {
                        const isSelected = selectedSavingsProduct?.id === product.id;
                        return (
                          <SavingsProductListRow
                            key={product.id}
                            product={product}
                            isSelected={isSelected}
                            onClick={() => setSelectedSavingsProduct(product)}
                          />
                        );
                      })
                    }
                  </SuspenseQuery>
                </AsyncBoundary>

                <Spacing size={40} />
              </>
            );
        }
      })()}
    </>
  );
}
