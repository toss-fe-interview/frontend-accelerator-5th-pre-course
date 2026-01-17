import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Assets,
  Border,
  colors,
  http,
  ListHeader,
  ListRow,
  NavigationBar,
  SelectBottomSheet,
  Spacing,
  Tab,
  TextField,
} from 'tosslib';

type SavingsTerm = 6 | 12 | 24;

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
  const [selectedTab, setSelectedTab] = useState<'products' | 'results'>('products');

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount}
        onChange={e => {
          const value = e.target.value.replace(/[^0-9]/g, '');
          setTargetAmount(value);
        }}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyAmount}
        onChange={e => {
          const value = e.target.value.replace(/[^0-9]/g, '');
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
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSelectedTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === 'products' && (
        <>
          {filteredProducts.map(product => {
            const isSelected = selectedProduct?.id === product.id;

            return (
              <ListRow
                key={product.id}
                contents={
                  <ListRow.Texts
                    type="3RowTypeA"
                    top={product.name}
                    topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                    middle={`연 이자율: ${product.annualRate}%`}
                    middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                    bottom={`${product.minMonthlyAmount.toLocaleString()}원 ~ ${product.maxMonthlyAmount.toLocaleString()}원 | ${product.availableTerms}개월`}
                    bottomProps={{ fontSize: 13, color: colors.grey600 }}
                  />
                }
                right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
                onClick={() => setSelectedProduct(product)}
              />
            );
          })}
        </>
      )}

      {selectedTab === 'results' && (
        <>
          {!selectedProduct ? (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          ) : (
            <>
              <Spacing size={8} />

              <ListRow
                contents={
                  <ListRow.Texts
                    type="2RowTypeA"
                    top="예상 수익 금액"
                    topProps={{ color: colors.grey600 }}
                    bottom={`${calculateExpectedRevenue(
                      toNumber(monthlyAmount),
                      savingsTerm,
                      selectedProduct.annualRate
                    ).toLocaleString()}원`}
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
                    bottom={`${calculateDifference(
                      toNumber(targetAmount),
                      calculateExpectedRevenue(toNumber(monthlyAmount), savingsTerm, selectedProduct.annualRate)
                    ).toLocaleString()}원`}
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
                    bottom={`${calculateRecommendedAmount(
                      toNumber(targetAmount),
                      savingsTerm,
                      selectedProduct.annualRate
                    ).toLocaleString()}원`}
                    bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                  />
                }
              />
            </>
          )}

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          {filteredProducts
            .sort((a, b) => b.annualRate - a.annualRate)
            .slice(0, 2)
            .map(product => {
              const isSelected = selectedProduct?.id === product.id;

              return (
                <ListRow
                  key={product.id}
                  contents={
                    <ListRow.Texts
                      type="3RowTypeA"
                      top={product.name}
                      topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                      middle={`연 이자율: ${product.annualRate}%`}
                      middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                      bottom={`${product.minMonthlyAmount.toLocaleString()}원 ~ ${product.maxMonthlyAmount.toLocaleString()}원 | ${product.availableTerms}개월`}
                      bottomProps={{ fontSize: 13, color: colors.grey600 }}
                    />
                  }
                  right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
                  onClick={() => setSelectedProduct(product)}
                />
              );
            })}

          <Spacing size={40} />
        </>
      )}
    </>
  );
}
