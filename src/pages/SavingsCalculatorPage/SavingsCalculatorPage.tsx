import { Border, ListRow, NavigationBar, Spacing } from 'tosslib';
import { useForm } from 'react-hook-form';
import { Tab } from 'components/Tab';
import { SavingsFilterForm } from './types/saving-filter-form';
import { AsyncBoundary } from 'components/AsyncBoundary';
import { SavingProductErrorFallback } from './components/fallback/SavingProductErrorFallback';
import { CurrencyTextField } from './components/fields/CurrencyTextField';
import { SelectTermField } from './components/fields/SelectTermField';
import { useEffect, useRef, useState } from 'react';
import { SavingsProduct } from './models/savings-products.dto';
import { savingsProductsQuery } from './queries/savings-products.query';
import { FilteredSavingsProducts } from './components/FilteredSavingsProducts';
import { RecommendedProducts } from './components/RecommendedProducts';
import { ProductItem } from './components/ProductItem';
import { CalculationResult } from './components/CalculationResult';
import { CalculationResultItem } from './components/CalculationResultItem';
import { SuspenseQuery } from '@suspensive/react-query';
import { match } from 'ts-pattern';

const TAB = {
  products: 'products',
  results: 'results',
} as const;

export function SavingsCalculatorPage() {
  const form = useForm<SavingsFilterForm>({
    defaultValues: {
      targetAmount: null,
      monthlyPayment: null,
      term: 12,
    },
  });
  const [targetAmount, monthlyPayment, term] = form.watch(['targetAmount', 'monthlyPayment', 'term']);

  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);
  const prevSelectedRef = useRef<SavingsProduct | null>(null);

  const handleSelectProduct = (product: SavingsProduct) => {
    setSelectedProduct(prev => (prev?.id === product.id ? null : product));
  };

  useEffect(
    function trackPreviousSelection() {
      prevSelectedRef.current = selectedProduct;
    },
    [selectedProduct]
  );

  useEffect(
    function resetSelectedProductOnFilterChange() {
      if (prevSelectedRef.current !== null) {
        // TODO: Toast로 변경
        console.log('조건 변경으로 상품 선택이 초기화되었습니다');
      }
      setSelectedProduct(null);
    },
    [monthlyPayment, term]
  );

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <div css={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <CurrencyTextField
          label="목표 금액"
          placeholder="목표 금액을 입력하세요"
          value={targetAmount}
          onChange={value => form.setValue('targetAmount', value)}
        />
        <CurrencyTextField
          label="월 납입액"
          placeholder="희망 월 납입액을 입력하세요"
          value={monthlyPayment}
          onChange={value => form.setValue('monthlyPayment', value)}
        />
        <SelectTermField
          label="저축 기간"
          title="저축 기간을 선택해주세요"
          options={[
            { value: 6, label: '6개월' },
            { value: 12, label: '12개월' },
            { value: 24, label: '24개월' },
          ]}
          value={term}
          onSelect={value => form.setValue('term', value)}
        />
      </div>
      <Spacing size={24} />

      <AsyncBoundary
        pendingFallback={<ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품 정보를 불러오는 중..." />} />}
        rejectedFallback={SavingProductErrorFallback}
      >
        <SuspenseQuery {...savingsProductsQuery}>
          {({ data: savingsProducts }) => (
            <Tab defaultValue={TAB.products}>
              <Tab.Item value={TAB.products}>적금 상품</Tab.Item>
              <Tab.Item value={TAB.results}>계산 결과</Tab.Item>

              <Tab.Content value={TAB.products}>
                <FilteredSavingsProducts savingsProducts={savingsProducts} filter={{ monthlyPayment, term }}>
                  {_ =>
                    match(_)
                      .with({ type: 'success' }, ({ products }) =>
                        products.map(product => (
                          <ProductItem
                            key={product.id}
                            product={product}
                            isSelected={selectedProduct?.id === product.id}
                            onSelectProduct={handleSelectProduct}
                          />
                        ))
                      )
                      .with({ type: 'empty' }, () => (
                        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없습니다." />} />
                      ))
                      .exhaustive()
                  }
                </FilteredSavingsProducts>
              </Tab.Content>

              <Tab.Content value={TAB.results}>
                <CalculationResult selectedProduct={selectedProduct} filter={{ targetAmount, monthlyPayment, term }}>
                  {_ =>
                    match(_)
                      .with(
                        { type: 'success' },
                        ({ result: { expectedAmount, difference, recommendedMonthlyPayment } }) => (
                          <>
                            <CalculationResultItem label="예상 수익 금액" value={expectedAmount} />
                            <CalculationResultItem label="목표 금액과의 차이" value={difference} />
                            <CalculationResultItem label="추천 월 납입 금액" value={recommendedMonthlyPayment} />
                          </>
                        )
                      )
                      .with({ type: 'productUnselected' }, () => (
                        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
                      ))
                      .with({ type: 'requiredInputEmpty' }, () => (
                        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="모든 필수 값을 입력해주세요." />} />
                      ))
                      .exhaustive()
                  }
                </CalculationResult>

                <Spacing size={8} />
                <Border height={16} />
                <Spacing size={8} />

                <RecommendedProducts savingsProducts={savingsProducts} filter={{ monthlyPayment, term }}>
                  {_ =>
                    match(_)
                      .with({ type: 'success' }, ({ products }) =>
                        products.map(product => (
                          <ProductItem
                            key={product.id}
                            product={product}
                            isSelected={selectedProduct?.id === product.id}
                            onSelectProduct={handleSelectProduct}
                          />
                        ))
                      )
                      .with({ type: 'empty' }, () => (
                        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="추천할 상품이 없습니다." />} />
                      ))
                      .exhaustive()
                  }
                </RecommendedProducts>
              </Tab.Content>
            </Tab>
          )}
        </SuspenseQuery>
      </AsyncBoundary>
      <Spacing size={40} />
    </>
  );
}
