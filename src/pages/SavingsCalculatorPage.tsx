import { Border, http, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SavingsProudctList } from 'components/SavingsProudctList';
import { CalculationResult } from 'components/CalculationResult';
import { formatCurrency, parseNumberInput } from 'utils/format';
import { SavingsProduct } from 'types/savings';
import { z } from 'zod';

const TabValueSchema = z.enum(['products', 'results']);
type TabValues = z.infer<typeof TabValueSchema>;

function filterProducts(products: SavingsProduct[], monthlyAmount: number | null, savingsTerm: number | null) {
  // 둘 다 없을 경우 → 모든 상품 표시
  if (monthlyAmount === null && savingsTerm === null) {
    return products;
  }

  // monthlyAmount만 있을 경우 → 최소값, 최대값으로만 필터링
  if (monthlyAmount !== null && savingsTerm === null) {
    return products.filter(product => {
      const isInRange = monthlyAmount >= product.minMonthlyAmount && monthlyAmount <= product.maxMonthlyAmount;
      return isInRange;
    });
  }

  // savingsTerm만 있을 경우 → savingsTerm으로만 필터링
  if (monthlyAmount === null && savingsTerm !== null) {
    return products.filter(product => Number(savingsTerm) === product.availableTerms);
  }

  // 둘 다 있을 경우 → 둘 다 합쳐서 필터링
  return products.filter(product => {
    const isInRange = monthlyAmount! >= product.minMonthlyAmount && monthlyAmount! <= product.maxMonthlyAmount;
    const isTermsEqual = Number(savingsTerm) === product.availableTerms;
    return isInRange && isTermsEqual;
  });
}

export function SavingsCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState<number | null>(null);
  const [monthlyAmount, setMonthlyAmount] = useState<number | null>(null);
  const [savingsTerm, setSavingsTerm] = useState<number | null>(null);
  const [currentTab, setCurrentTab] = useState<TabValues>('products');
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);

  const { data: savingsProductsList } = useQuery({
    queryKey: ['savingsProductsList'],
    queryFn: () => http.get<SavingsProduct[]>('/api/savings-products'),
  });

  // 필터링 된 상품 리스트
  const filteredSavingsProductList = filterProducts(savingsProductsList ?? [], monthlyAmount, savingsTerm);

  // 추천 상품 리스트
  const recommendedProductList = [...(filteredSavingsProductList ?? [])]
    .sort((a, b) => b.annualRate - a.annualRate)
    .slice(0, 2);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount !== null ? formatCurrency(targetAmount) : ''}
        onChange={e => setTargetAmount(parseNumberInput(e.target.value))}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyAmount !== null ? formatCurrency(monthlyAmount) : ''}
        onChange={e => setMonthlyAmount(parseNumberInput(e.target.value))}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsTerm}
        onChange={value => setSavingsTerm(value)}
      >
        <SelectBottomSheet.Option value="6">6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value="12">12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value="18">18개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value="24">24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab
        onChange={value => {
          const parsed = TabValueSchema.safeParse(value);
          if (parsed.success) {
            setCurrentTab(parsed.data);
          }
        }}
      >
        <Tab.Item value="products" selected={currentTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={currentTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {currentTab === 'products' && (
        <SavingsProudctList
          filteredSavingsProductList={filteredSavingsProductList ?? []}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
      )}
      {currentTab === 'results' && (
        <CalculationResult
          recommendedProductList={recommendedProductList}
          selectedProduct={selectedProduct}
          targetAmount={targetAmount}
          monthlyAmount={monthlyAmount}
          savingsTerm={savingsTerm}
          setSelectedProduct={setSelectedProduct}
        />
      )}
    </>
  );
}
