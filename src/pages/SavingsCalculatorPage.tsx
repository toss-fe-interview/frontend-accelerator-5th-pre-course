import React, { useState, useEffect } from 'react';
import { http, TextField, Spacing, SelectBottomSheet, ListRow, colors } from 'tosslib';
import { SavingsProduct } from '../components/Savings';
import { SavingsNavigationBar } from '../components/Savings/SavingsNavigationBar';
import { SavingsDivider } from '../components/Savings/SavingsDivider';
import { SavingsTabNavigation } from '../components/Savings/SavingsTabNavigation';
import { SavingTabContent } from '../components/Savings/SavingTabContent';
import { ProductList } from '../components/Savings/ProductList';
import { RecommendedProduct } from '../components/Savings/Result/RecommendedProduct';
import { filterSavingsProducts, getTopRateProducts } from 'utils/savings';

export type SavingsTabValue = 'products' | 'results';

export type SavingTabListType = {
  value: SavingsTabValue;
  name: string;
}[];

function calculateExpectedProfit(monthlyDeposit: number, period: number, annualRate: number): number {
  return monthlyDeposit * period * (1 + annualRate * 0.5);
}

function calculateGoalDifference(goalAmount: number, expectedProfit: number): number {
  return goalAmount - expectedProfit;
}

function calculateRecommendedDeposit(goalAmount: number, period: number, annualRate: number): number {
  const rawAmount = goalAmount / (period * (1 + annualRate * 0.5));
  return Math.round(rawAmount / 1000) * 1000;
}

export function SavingsCalculatorPage() {
  // 계산기 상태
  const [goalAmount, setGoalAmount] = useState('');
  const [monthlyDeposit, setMonthlyDeposit] = useState('');
  const [savingsPeriod, setSavingsPeriod] = useState(12);

  // 상품 상태
  const [products, setProducts] = useState<SavingsProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<SavingsTabValue>('products');

  // API fetch
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await http.get<SavingsProduct[]>('/api/savings-products');
      setProducts(response);
    };
    fetchProducts();
  }, []);

  const tabs: SavingTabListType = [
    { value: 'products', name: '적금 상품' },
    { value: 'results', name: '계산 결과' },
  ];

  // 결과 계산
  const selectedProduct = products.find(p => p.id === selectedProductId);
  const annualRate = selectedProduct?.annualRate ?? 0;
  const expectedProfit = calculateExpectedProfit(Number(monthlyDeposit) || 0, savingsPeriod, annualRate);
  const goalDifference = calculateGoalDifference(Number(goalAmount) || 0, expectedProfit);
  const recommendedDeposit = calculateRecommendedDeposit(Number(goalAmount) || 0, savingsPeriod, annualRate);

  return (
    <>
      <SavingsNavigationBar title="적금 계산기" />
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={goalAmount}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGoalAmount(e.target.value)}
      />
      <Spacing size={16} />

      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyDeposit}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMonthlyDeposit(e.target.value)}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsPeriod}
        onChange={(v: number) => setSavingsPeriod(v)}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <SavingsDivider />
      <SavingsTabNavigation
        tabs={tabs}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
      <SavingTabContent
        selectedTab={selectedTab}
        renderProps={tab => (
          <>
            {tab === 'products' && (
              <ProductList
                list={filterSavingsProducts(products, {
                  monthlyDeposit: Number(monthlyDeposit),
                  period: savingsPeriod,
                })}
                selectedProductId={selectedProductId}
                onClick={setSelectedProductId}
              />
            )}
            {tab === 'results' && (
              <>
                {!selectedProductId ? (
                  <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요" />} />
                ) : (
                  <>
                    <Spacing size={8} />
                    <ListRow
                      contents={
                        <ListRow.Texts
                          type="2RowTypeA"
                          top="예상 수익 금액"
                          topProps={{ color: colors.grey600 }}
                          bottom={`${expectedProfit.toLocaleString()}원`}
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
                          bottom={`${goalDifference.toLocaleString()}원`}
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
                          bottom={`${recommendedDeposit.toLocaleString()}원`}
                          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                        />
                      }
                    />
                  </>
                )}
                <RecommendedProduct title="추천 상품 목록">
                  <ProductList
                    list={getTopRateProducts(products, 2)}
                    selectedProductId={selectedProductId}
                    onClick={setSelectedProductId}
                    emptyMessage="추천 상품이 없습니다."
                  />
                </RecommendedProduct>
              </>
            )}
          </>
        )}
      />
    </>
  );
}
