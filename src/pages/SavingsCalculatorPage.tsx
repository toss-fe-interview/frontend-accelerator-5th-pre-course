import { fetchProducts } from 'domains/Savings/api/fetchProducts';
import { Divider } from 'domains/Savings/components/Divider';
import { ProductList } from 'domains/Savings/components/ProductList';
import { RecommendedProduct } from 'domains/Savings/components/RecommendedProduct';
import { SavingsNavigationBar } from 'domains/Savings/components/SavingsNavigationBar';
import { SavingsTabNavigation } from 'domains/Savings/components/SavingsTabNavigation';
import { SavingTabContent } from 'domains/Savings/components/SavingTabContent';
import type { SavingsProduct, SavingsTabValue, SavingTabListType } from 'domains/Savings/types';
import { calculateExpectedProfit, calculateGoalDifference, calculateRecommendedDeposit, filterSavingsProducts, getTopRateProducts } from 'domains/Savings/utils/savings';
import React, { useState, useEffect } from 'react';
import { TextField, Spacing, SelectBottomSheet, ListRow, colors } from 'tosslib';


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
    fetchProducts().then(setProducts);
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

      <Divider />
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
