import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Border, http, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab } from 'tosslib';
import { AmountField } from './components/AmountField';
import { SavingsProductItem } from './components/SavingsProductItem';
import { CalculationResultRow } from './components/CalculationResultRow';

type SavingsTerm = 6 | 12 | 24;

const SAVINGS_TERM_OPTIONS = [6, 12, 24] as const satisfies readonly SavingsTerm[];

type TabValue = 'products' | 'results';

interface SavingsProduct {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: SavingsTerm;
}

const toNumber = (value: string): number => {
  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
};

const matchesMonthlyAmountAndTerm = (product: SavingsProduct, monthlyAmount: number, savingsTerm: SavingsTerm) => {
  if (monthlyAmount === 0) {
    return product.availableTerms === savingsTerm;
  }

  return (
    monthlyAmount >= product.minMonthlyAmount &&
    monthlyAmount <= product.maxMonthlyAmount &&
    product.availableTerms === savingsTerm
  );
};

const calculateExpectedRevenue = (monthlyAmount: number, savingsTerm: SavingsTerm, annualRate: number) => {
  return monthlyAmount * savingsTerm * (1 + (annualRate / 100) * 0.5);
};

const calculateDifference = (targetAmount: number, expectedRevenue: number) => {
  return targetAmount - expectedRevenue;
};

const calculateRecommendedAmount = (targetAmount: number, savingsTerm: SavingsTerm, annualRate: number) => {
  return Math.round(targetAmount / (savingsTerm * (1 + (annualRate / 100) * 0.5)) / 1000) * 1000;
};

export function SavingsCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [savingsTerm, setSavingsTerm] = useState<SavingsTerm>(12);

  const { data: filteredProducts = [] } = useQuery({
    queryKey: ['savings-products', monthlyAmount, savingsTerm],
    queryFn: () => http.get<SavingsProduct[]>('/api/savings-products'),
    select: products =>
      products.filter(product => matchesMonthlyAmountAndTerm(product, toNumber(monthlyAmount), savingsTerm)),
  });

  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabValue>('products');

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      {/* AmountField: 금액을 입력받는다 */}
      <AmountField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        value={targetAmount}
        onChange={setTargetAmount}
      />
      <Spacing size={16} />
      <AmountField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        value={monthlyAmount}
        onChange={value => {
          setMonthlyAmount(value);
          setSelectedProduct(null);
        }}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsTerm}
        onChange={value => {
          setSavingsTerm(value);
          setSelectedProduct(null);
        }}
      >
        {SAVINGS_TERM_OPTIONS.map(term => (
          <SelectBottomSheet.Option key={term} value={term}>
            {term}개월
          </SelectBottomSheet.Option>
        ))}
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSelectedTab(value as TabValue)}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {/* SavingsProductItem: 적금 상품의 이름, 연이자율, 월납입 범위, 기간을 행으로 보여주고 선택할 수 있다 */}
      {selectedTab === 'products' && (
        <>
          {filteredProducts.map(product => {
            const isSelected = selectedProduct?.id === product.id;

            return (
              <SavingsProductItem
                key={product.id}
                name={product.name}
                annualRate={product.annualRate}
                monthlyRange={{ min: product.minMonthlyAmount, max: product.maxMonthlyAmount }}
                term={product.availableTerms}
                selected={isSelected}
                onSelect={() => setSelectedProduct(product)}
              />
            );
          })}
        </>
      )}

      {/* CalculationResultRow: 계산 결과 항목을 레이블과 금액으로 보여준다 */}
      {selectedTab === 'results' && (
        <>
          {!selectedProduct ? (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          ) : (
            <>
              <Spacing size={8} />

              <CalculationResultRow
                label="예상 수익 금액"
                amount={calculateExpectedRevenue(toNumber(monthlyAmount), savingsTerm, selectedProduct.annualRate)}
              />
              <CalculationResultRow
                label="목표 금액과의 차이"
                amount={calculateDifference(
                  toNumber(targetAmount),
                  calculateExpectedRevenue(toNumber(monthlyAmount), savingsTerm, selectedProduct.annualRate)
                )}
              />
              <CalculationResultRow
                label="추천 월 납입 금액"
                amount={calculateRecommendedAmount(toNumber(targetAmount), savingsTerm, selectedProduct.annualRate)}
              />
            </>
          )}

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          {/* 추천 상품 목록: SavingsProductItem 재사용 */}
          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          {filteredProducts
            .sort((a, b) => b.annualRate - a.annualRate)
            .slice(0, 2)
            .map(product => {
              const isSelected = selectedProduct?.id === product.id;

              return (
                <SavingsProductItem
                  key={product.id}
                  name={product.name}
                  annualRate={product.annualRate}
                  monthlyRange={{ min: product.minMonthlyAmount, max: product.maxMonthlyAmount }}
                  term={product.availableTerms}
                  selected={isSelected}
                  onSelect={() => setSelectedProduct(product)}
                />
              );
            })}

          <Spacing size={40} />
        </>
      )}
    </>
  );
}
