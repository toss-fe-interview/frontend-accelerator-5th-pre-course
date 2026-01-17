import { Suspense, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Border, ListHeader, ListRow, NavigationBar, Spacing } from 'tosslib';
import { NumberInput } from 'shared/ui/NumberInput';
import { Select } from 'shared/ui/Select';
import type { SavingsProduct } from 'features/savings-calculator/api/savings';
import { CalculationResults, ProductList, ProductListItem, savingsCalculatorSchema } from 'features/savings-calculator';
import { Tabs } from 'shared/ui/Tabs';
import { SavingsCalculation } from 'shared/utils/savings-calculation';
import { zodResolver } from '@hookform/resolvers/zod';

export function SavingsCalculatorPage() {
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | undefined>(undefined);

  const form = useForm({
    defaultValues: {
      targetAmount: 1000000,
      monthlyAmount: 50000,
      availableTerms: 12,
    },
    resolver: zodResolver(savingsCalculatorSchema),
  });

  const { targetAmount, monthlyAmount, availableTerms } = form.watch();

  const { expectedAmount, difference, recommendedMonthlyAmount } = SavingsCalculation.getSummaryResults({
    targetAmount,
    monthlyAmount,
    availableTerms,
    annualRate: selectedProduct?.annualRate ?? 0,
  });

  const filterProductByAmountAndTerm = (product: SavingsProduct) =>
    product.minMonthlyAmount <= monthlyAmount &&
    product.maxMonthlyAmount >= monthlyAmount &&
    product.availableTerms <= availableTerms;

  const sortByHighestAnnualRate = (a: SavingsProduct, b: SavingsProduct) => b.annualRate - a.annualRate;

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />
      <Controller
        name="targetAmount"
        control={form.control}
        render={({ field }) => (
          <NumberInput
            label="목표 금액"
            placeholder="목표 금액을 입력하세요"
            suffix="원"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Spacing size={16} />
      <Controller
        name="monthlyAmount"
        control={form.control}
        render={({ field }) => (
          <NumberInput
            label="월 납입액"
            placeholder="희망 월 납입액을 입력하세요"
            suffix="원"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Spacing size={16} />
      <Controller
        name="availableTerms"
        control={form.control}
        render={({ field }) => (
          <Select
            label="저축 기간"
            title="저축 기간을 선택해주세요"
            value={field.value}
            onChange={field.onChange}
            options={[
              { value: 6, label: '6개월' },
              { value: 12, label: '12개월' },
              { value: 24, label: '24개월' },
            ]}
          />
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
              select={products => products.filter(filterProductByAmountAndTerm)}
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
                  select={products =>
                    products.filter(filterProductByAmountAndTerm).sort(sortByHighestAnnualRate).slice(0, 2)
                  }
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
