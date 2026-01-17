import { useQuery } from '@tanstack/react-query';
import { ProductList, savingsProductsQueryOptions } from 'components/ProductList';
import type { SavingsTabValue } from 'domains/Savings/types';
import {
  calculateExpectedProfit,
  calculateGoalDifference,
  calculateRecommendedDeposit,
  filterSavingsProducts,
  getTopRateProducts,
} from 'domains/Savings/utils/savings';
import React, { Suspense, useState } from 'react';
import {
  Spacing,
  SelectBottomSheet,
  ListRow,
  colors,
  Assets,
  ListHeader,
  Border,
  Tab,
  NavigationBar,
  TextField,
} from 'tosslib';

export function SavingsCalculatorPage() {
  // 계산기 상태
  const [goalAmount, setGoalAmount] = useState('');
  const [monthlyDeposit, setMonthlyDeposit] = useState('');
  const [savingsPeriod, setSavingsPeriod] = useState(12);

  // 상품 상태
  const { data: products = [] } = useQuery(savingsProductsQueryOptions);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<SavingsTabValue>('products');

  // TODO : 어떻게 리팩터링할까?
  const selectedProduct = products.find(p => p.id === selectedProductId);
  const hasProduct = !selectedProduct;
  const annualRate = selectedProduct?.annualRate ?? 0;
  // 예상 수익 금액 : 최종 금액 = 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)
  const expectedProfit = calculateExpectedProfit(Number(monthlyDeposit) || 0, savingsPeriod, annualRate);
  // 목표 금액과의 차이 : 목표 금액과의 차이 = 목표 금액 - 예상 수익 금액
  const goalDifference = calculateGoalDifference(Number(goalAmount) || 0, expectedProfit);
  // 추천 월 납입 금액 : 월 납입액 = 목표 금액 ÷ (저축 기간 * (1 + 연이자율 * 0.5))
  const recommendedDeposit = calculateRecommendedDeposit(Number(goalAmount) || 0, savingsPeriod, annualRate);

  return (
    // 계산기의 본질. 숫자를 입력, 결과를 보여준다.
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={Number(goalAmount).toLocaleString('ko-KR')}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGoalAmount(e.target.value)}
        // 콤마처리 숫자입력할때 보여질 필요가 없으니, 추상화한다.
      />
      <Spacing size={16} />

      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={Number(monthlyDeposit).toLocaleString('ko-KR')}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMonthlyDeposit(e.target.value)}
      />
      <Spacing size={16} />

      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsPeriod}
        onChange={(value: number) => setSavingsPeriod(value)}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
      <Divider />

      <Tab onChange={v => setSelectedTab(v as SavingsTabValue)}>
        <Tab.Item value={'products'} selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value={'results'} selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === 'products' && (
        <Suspense fallback={<div>로딩 중...</div>}>
          <ProductList
            select={products =>
              filterSavingsProducts(products, {
                monthlyDeposit: Number(monthlyDeposit),
                period: savingsPeriod,
              })
            }
            renderProps={product => {
              const isSelected = selectedProductId === product.id;
              return (
                <ListRow
                  key={product.id}
                  contents={
                    <ListRow.Texts
                      type="3RowTypeA"
                      top={product.name}
                      topProps={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: colors.grey900,
                      }}
                      middle={`연 이자율: ${product.annualRate}%`}
                      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                      bottom={`${product.availableTerms}개월`}
                      bottomProps={{ fontSize: 13, color: colors.grey600 }}
                    />
                  }
                  right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
                  onClick={() => setSelectedProductId(product.id)}
                />
              );
            }}
          />
        </Suspense>
      )}
      <Spacing size={8} />
      {selectedTab === 'results' && (
        <>
          {hasProduct ? (
            // 추상화 레벨이 맞지 않음.
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
          <Suspense fallback={<div>로딩 중...</div>}>
            <ProductList
              select={products => getTopRateProducts(products, 2)}
              renderProps={product => {
                const isSelected = selectedProductId === product.id;
                return (
                  <ListRow
                    key={product.id}
                    contents={
                      <ListRow.Texts
                        type="3RowTypeA"
                        top={product.name}
                        topProps={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: colors.grey900,
                        }}
                        middle={`연 이자율: ${product.annualRate}%`}
                        middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                        bottom={`${product.availableTerms}개월`}
                        bottomProps={{ fontSize: 13, color: colors.grey600 }}
                      />
                    }
                    right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
                    onClick={() => setSelectedProductId(product.id)}
                  />
                );
              }}
            />
          </Suspense>
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

interface DividerProps {
  spacing?: number;
  height?: number;
}

function Divider({ spacing = 24, height = 16 }: DividerProps) {
  return (
    <>
      <Spacing size={spacing} />
      <Border height={height} />
      <Spacing size={8} />
    </>
  );
}
