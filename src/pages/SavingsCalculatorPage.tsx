import { Suspense, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Border, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { useSavingsCalculatorForm } from 'features/savings-calculator/model/useSavingsCalculatorForm';
import type { SavingsProduct } from 'features/savings-calculator/api/savings';
import { CalculationResults, ProductList, ProductListItem, useSavingsCalculation } from 'features/savings-calculator';
import { Tabs } from 'shared/ui/Tabs';

export function SavingsCalculatorPage() {
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | undefined>(undefined);
  const form = useSavingsCalculatorForm();

  const { targetAmount, monthlyAmount, availableTerms } = form.watch();

  const { expectedAmount, difference, recommendedMonthlyAmount } = useSavingsCalculation({
    targetAmount,
    monthlyAmount,
    availableTerms,
    annualRate: selectedProduct?.annualRate ?? 0,
  });

  const filterProductByAmountAndTerm = (product: SavingsProduct) =>
    product.minMonthlyAmount <= monthlyAmount &&
    product.maxMonthlyAmount >= monthlyAmount &&
    product.availableTerms <= availableTerms;

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />
      <Controller
        name="targetAmount"
        control={form.control}
        render={({ field }) => (
          <TextField
            label="목표 금액"
            placeholder="목표 금액을 입력하세요"
            suffix="원"
            value={field.value ? field.value.toString() : ''}
            onChange={event => field.onChange(Number(event.target.value))}
          />
        )}
      />
      <Spacing size={16} />
      <Controller
        name="monthlyAmount"
        control={form.control}
        render={({ field }) => (
          <TextField
            label="월 납입액"
            placeholder="희망 월 납입액을 입력하세요"
            suffix="원"
            value={field.value?.toString()}
            onChange={event => field.onChange(Number(event.target.value))}
          />
        )}
      />
      <Spacing size={16} />
      <Controller
        name="availableTerms"
        control={form.control}
        render={({ field }) => (
          <SelectBottomSheet
            label="저축 기간"
            title="저축 기간을 선택해주세요"
            value={field.value}
            onChange={value => field.onChange(value)}
          >
            <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
            <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
            <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
          </SelectBottomSheet>
        )}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />
      <Tabs
        defaultValue="products"
        items={[
          { value: 'products', label: '적금 상품' },
          { value: 'results', label: '계산 결과' },
        ]}
      >
        <Tabs.List />
        <Tabs.Content value="products">
          <Suspense>
            <ProductList
              filterBy={filterProductByAmountAndTerm}
              renderItem={product => (
                <ProductListItem
                  product={product}
                  isSelected={selectedProduct?.id === product.id}
                  onClick={() => setSelectedProduct(product)}
                />
              )}
            />
          </Suspense>
        </Tabs.Content>
        <Tabs.Content value="results">
          {!selectedProduct ? (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          ) : (
            <>
              <CalculationResults
                expectedAmount={expectedAmount}
                difference={difference}
                recommendedMonthlyAmount={recommendedMonthlyAmount}
              />
              <Spacing size={8} />
              <Border height={16} />
              <Spacing size={8} />
              <ListHeader
                title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
              />
              <Spacing size={12} />
              <Suspense>
                <ProductList
                  filterBy={filterProductByAmountAndTerm}
                  sortBy={(a, b) => b.annualRate - a.annualRate}
                  limit={2}
                  renderItem={product => (
                    <ProductListItem product={product} isSelected={selectedProduct.id === product.id} />
                  )}
                />
              </Suspense>
              <Spacing size={40} />
            </>
          )}
        </Tabs.Content>
      </Tabs>
    </>
  );
}
