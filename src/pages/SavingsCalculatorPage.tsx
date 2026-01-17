import { useQuery } from '@tanstack/react-query';
import { ProductList, savingsProductsQueryOptions } from 'domains/Savings/components/ProductList';
import { SavingsTabValue } from 'domains/Savings/types';
import { 적금상품필터링, 추천상품필터링 } from 'domains/Savings/utils/productFilter';
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
  const [goalAmount, setGoalAmount] = useState(0);
  const [monthlyDeposit, setMonthlyDeposit] = useState(0);
  const [savingsPeriod, setSavingsPeriod] = useState(12);

  // 상품 상태
  const { data: products = [] } = useQuery(savingsProductsQueryOptions);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<SavingsTabValue>('products');

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const hasProduct = !selectedProduct;
  const annualRate = selectedProduct?.annualRate ?? 0;

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={goalAmount ? goalAmount.toLocaleString() : ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setGoalAmount(Number(e.target.value.replace(/,/g, '')) || 0)
        }
      />
      <Spacing size={16} />

      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyDeposit ? monthlyDeposit.toLocaleString() : ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMonthlyDeposit(Number(e.target.value.replace(/,/g, '')) || 0)
        }
      />
      <Spacing size={16} />

      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsPeriod}
        onChange={(period: number) => setSavingsPeriod(period)}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
      <Divider />

      <Tab onChange={tab => setSelectedTab(tab as SavingsTabValue)}>
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
              적금상품필터링(products, {
                monthlyDeposit: Number(monthlyDeposit),
                period: savingsPeriod,
              })
            }
            renderProps={product => {
              const isSelected = selectedProductId === product.id;
              return (
                <ListRow
                  key={product.id}
                  contents={<ProductList.Item product={product} />}
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
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요" />} />
          ) : (
            (() => {
              const 예상수익금액 = monthlyDeposit * savingsPeriod * (1 + annualRate * 0.5);
              const 목표금액과의차이 = goalAmount - 예상수익금액;
              const rawAmount = goalAmount / (savingsPeriod * (1 + annualRate * 0.5));
              const 추천월납입금액 = Math.round(rawAmount / 1000) * 1000;

              return (
                <>
                  <CalculationResultItem name="예상 수익 금액" price={예상수익금액} unit="원" />
                  <CalculationResultItem name="목표 금액과의 차이" price={목표금액과의차이} unit="원" />
                  <CalculationResultItem name="추천 월 납입 금액" price={추천월납입금액} unit="원" />
                </>
              );
            })()
          )}
          <Divider spacing={8} />
          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          <Suspense fallback={<div>로딩 중...</div>}>
            <ProductList
              select={products => 추천상품필터링(products)}
              renderProps={product => {
                const isSelected = selectedProductId === product.id;
                return (
                  <ListRow
                    key={product.id}
                    contents={<ProductList.Item product={product} />}
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
