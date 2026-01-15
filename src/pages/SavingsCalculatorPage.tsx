import { Suspense, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Assets, Border, colors, ListRow, NavigationBar, SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { useSavingsCalculatorForm } from 'features/savings-calculator/model/useSavingsCalculatorForm';
import { useSavingsProducts } from 'features/savings-calculator/model/useSavingsProducts';
import type { SavingsProduct } from 'features/savings-calculator/api/savings';
import { Tabs } from 'shared/ui/Tabs';
import { formatCurrency } from 'shared/utils/format';
import { calculateDifference, calculateExpectedAmount, calculateRecommendedMonthlyAmount } from 'shared/utils/savings';
import { RecommendedProductList } from 'features/savings-calculator';

export function SavingsCalculatorPage() {
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | undefined>(undefined);
  const form = useSavingsCalculatorForm();
  const { targetAmount, monthlyAmount, availableTerms } = form.watch();

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
            <ProductListContent
              monthlyAmount={monthlyAmount}
              availableTerms={availableTerms}
              selectedProductId={selectedProduct?.id}
              onSelectProduct={setSelectedProduct}
            />
          </Suspense>
        </Tabs.Content>
        <Tabs.Content value="results">
          <Suspense>
            <ResultsContent
              targetAmount={targetAmount}
              monthlyAmount={monthlyAmount}
              availableTerms={availableTerms}
              selectedProduct={selectedProduct}
            />
          </Suspense>
        </Tabs.Content>
      </Tabs>
    </>
  );
}

function ProductListContent({
  monthlyAmount,
  availableTerms,
  selectedProductId,
  onSelectProduct,
}: {
  monthlyAmount: number;
  availableTerms: number;
  selectedProductId?: string;
  onSelectProduct: (product: SavingsProduct) => void;
}) {
  const { products } = useSavingsProducts({ monthlyAmount, availableTerms });

  return products.map((product: SavingsProduct) => (
    <ListRow
      key={product.id}
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={product.name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${product.annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${formatCurrency(product.minMonthlyAmount)} ~ ${formatCurrency(product.maxMonthlyAmount)} | ${product.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
      onClick={() => onSelectProduct(product)}
    />
  ));
}

// SavingsCalculatorResults 내부를 꺼냄
function ResultsContent({
  targetAmount,
  monthlyAmount,
  availableTerms,
  selectedProduct,
}: {
  targetAmount: number;
  monthlyAmount: number;
  availableTerms: number;
  selectedProduct?: SavingsProduct;
}) {
  if (!selectedProduct) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  const expectedAmount = calculateExpectedAmount(monthlyAmount, availableTerms, selectedProduct.annualRate);
  const difference = calculateDifference(targetAmount, expectedAmount);
  const recommendedMonthlyAmount = calculateRecommendedMonthlyAmount(
    targetAmount,
    availableTerms,
    selectedProduct.annualRate
  );

  return (
    <>
      <Spacing size={8} />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={formatCurrency(expectedAmount)}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="목표 금액과의 차이"
            topProps={{ color: colors.grey600 }}
            bottom={formatCurrency(difference)}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="추천 월 납입 금액"
            topProps={{ color: colors.grey600 }}
            bottom={formatCurrency(recommendedMonthlyAmount)}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <RecommendedProductList
        monthlyAmount={monthlyAmount}
        availableTerms={availableTerms}
        selectedProductId={selectedProduct?.id}
      />

      <Spacing size={40} />
    </>
  );
}
