import { fetchProducts } from 'domains/Savings/api/fetchProducts';
import { CalculationResultItem } from 'domains/Savings/components/CalculationResultItem';
import { Divider } from 'domains/Savings/components/Divider';
import { SavingProduct } from 'domains/Savings/components/SavingProduct';
import { SavingsTabNavigation } from 'domains/Savings/components/SavingsTabNavigation';
import type { SavingsProduct, SavingsTabValue } from 'domains/Savings/types';
import {
  calculateExpectedProfit,
  calculateGoalDifference,
  calculateRecommendedDeposit,
  filterSavingsProducts,
  getTopRateProducts,
} from 'domains/Savings/utils/savings';
import React, { useState, useEffect } from 'react';
import { TextField, Spacing, SelectBottomSheet, ListRow, colors, Assets, ListHeader, NavigationBar } from 'tosslib';

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

  // 결과 계산
  const selectedProduct = products.find(p => p.id === selectedProductId);

  const hasProduct = !selectedProduct;
  const annualRate = selectedProduct?.annualRate ?? 0;
  const expectedProfit = calculateExpectedProfit(Number(monthlyDeposit) || 0, savingsPeriod, annualRate);
  const goalDifference = calculateGoalDifference(Number(goalAmount) || 0, expectedProfit);
  const recommendedDeposit = calculateRecommendedDeposit(Number(goalAmount) || 0, savingsPeriod, annualRate);

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />
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
        tabs={[
          { value: 'products', name: '적금 상품' },
          { value: 'results', name: '계산 결과' },
        ]}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />

      {selectedTab === 'products' &&
        filterSavingsProducts(products, {
          monthlyDeposit: Number(monthlyDeposit),
          period: savingsPeriod,
        }).map(product => {
          const isSelected = selectedProductId === product.id;
          return (
            <ListRow
              key={product.id}
              contents={
                <SavingProduct
                  name={product.name}
                  interestRate={`${product.annualRate}`}
                  depositRange={`${product.minMonthlyAmount.toLocaleString()}원 ~ ${product.maxMonthlyAmount.toLocaleString()}원`}
                  termMonths={`${product.availableTerms}`}
                />
              }
              right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
              onClick={() => setSelectedProductId(product.id)}
            />
          );
        })}

      <Spacing size={8} />
      {selectedTab === 'results' && (
        <>
          {hasProduct ? (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요" />} />
          ) : (
            <>
              <CalculationResultItem name="예상 수익 금액" price={expectedProfit} unit="원" />
              <CalculationResultItem name="목표 금액과의 차이" price={goalDifference} unit="원" />
              <CalculationResultItem name="추천 월 납입 금액" price={recommendedDeposit} unit="원" />
            </>
          )}
          <Divider spacing={8} />
          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />
          {getTopRateProducts(products, 2).map(product => {
            const isSelected = selectedProductId === product.id;
            return (
              <ListRow
                key={product.id}
                contents={
                  <SavingProduct
                    name={product.name}
                    interestRate={`${product.annualRate}`}
                    depositRange={`${product.minMonthlyAmount.toLocaleString()}원 ~ ${product.maxMonthlyAmount.toLocaleString()}원`}
                    termMonths={`${product.availableTerms}`}
                  />
                }
                right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
                onClick={() => setSelectedProductId(product.id)}
              />
            );
          })}
        </>
      )}
    </>
  );
}

interface CalculationResultItemProps {
  name: string;
  price: number;
  unit: string;
}

function CalculationResultItem({ name, price, unit }: CalculationResultItemProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={name}
          topProps={{ color: colors.grey600 }}
          bottom={`${price.toLocaleString()}${unit}`}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
}

type Props = {
  name: string;
  interestRate: string; // 이자율
  depositRange: string; // 적금납입가능액수
  termMonths: string; // 적금납입기간
};

const SavingProduct = ({ name, interestRate, depositRange, termMonths }: Props) => {
  return (
    <ListRow.Texts
      type="3RowTypeA"
      top={name}
      topProps={{
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.grey900,
      }}
      middle={`연 이자율: ${interestRate}%`}
      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
      bottom={`${depositRange} | ${termMonths}개월`}
      bottomProps={{ fontSize: 13, color: colors.grey600 }}
    />
  );
};
