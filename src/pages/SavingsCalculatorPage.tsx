import { useSavingsCalculator, useSavingsForm } from 'features/savings-calculator';
import { useState } from 'react';
import { useSavingsProducts } from 'shared/hooks';
import { SavingsProduct } from 'shared/types';
import { formatNumber } from 'shared/utils';
import {
  Assets,
  Border,
  colors,
  ListHeader,
  ListRow,
  NavigationBar,
  SelectBottomSheet,
  Spacing,
  Tab,
  TextField,
} from 'tosslib';

const TAB_VALUES = {
  SAVINGS_PRODUCTS: 'savingsProducts',
  CALCULATED_RESULT: 'calculatedResult',
} as const;

type TabValue = (typeof TAB_VALUES)[keyof typeof TAB_VALUES];

export function SavingsCalculatorPage() {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabValue>(TAB_VALUES.SAVINGS_PRODUCTS);
  const { data: products = [] } = useSavingsProducts();
  const { goalAmount, monthlyAmount, term, handleGoalAmountChange, handleMonthlyAmountChange, handleTermChange } =
    useSavingsForm();
  const { filteredProducts, selectedProduct, recommendedProducts, calculationResult } = useSavingsCalculator({
    products,
    goalAmount,
    monthlyAmount,
    term,
    selectedProductId,
  });

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={goalAmount !== null ? formatNumber(goalAmount) : ''}
        onChange={handleGoalAmountChange}
      />

      <Spacing size={16} />

      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyAmount !== null ? formatNumber(monthlyAmount) : ''}
        onChange={handleMonthlyAmountChange}
      />

      <Spacing size={16} />

      <SelectBottomSheet label="저축 기간" title="저축 기간을 선택해주세요" value={term} onChange={handleTermChange}>
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSelectedTab(value as TabValue)}>
        <Tab.Item value={TAB_VALUES.SAVINGS_PRODUCTS} selected={selectedTab === TAB_VALUES.SAVINGS_PRODUCTS}>
          적금 상품
        </Tab.Item>
        <Tab.Item value={TAB_VALUES.CALCULATED_RESULT} selected={selectedTab === TAB_VALUES.CALCULATED_RESULT}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === TAB_VALUES.SAVINGS_PRODUCTS &&
        filteredProducts.map((product: SavingsProduct) => {
          const isSelected = selectedProductId === product.id;
          return (
            <ListRow
              key={product.id}
              onClick={() => setSelectedProductId(product.id)}
              right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
              contents={<SavingProductItem product={product} />}
            />
          );
        })}
      {selectedTab === TAB_VALUES.CALCULATED_RESULT &&
        (() => {
          const isProductNotSelected = selectedProduct === null || calculationResult === null;

          if (isProductNotSelected) {
            return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
          }

          return (
            <>
              <Spacing size={8} />

              <ListRow
                contents={
                  <CalculationResultItem label="예상 수익 금액" price={calculationResult.expectedProfit ?? 0} />
                }
              />

              <ListRow
                contents={
                  <CalculationResultItem label="목표 금액과의 차이" price={calculationResult.goalDifference ?? 0} />
                }
              />

              <ListRow
                contents={
                  <CalculationResultItem
                    label="추천 월 납입 금액"
                    price={calculationResult.recommendedMonthlyAmount ?? 0}
                  />
                }
              />

              <Spacing size={8} />
              <Border height={16} />
              <Spacing size={8} />

              <ListHeader
                title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
              />
              <Spacing size={12} />

              {recommendedProducts.map(product => (
                <ListRow
                  key={product.id}
                  right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
                  contents={<SavingProductItem product={product} />}
                />
              ))}

              <Spacing size={40} />
            </>
          );
        })()}
    </>
  );
}

const CalculationResultItem = ({ label, price }: { label: string; price: number }) => {
  const CALCULATION_RESULT_ITEM_STYLES = {
    topProps: { color: colors.grey600 },
    bottomProps: { fontWeight: 'bold', color: colors.blue600 },
  } as const;
  return (
    <ListRow.Texts
      type="2RowTypeA"
      top={label}
      bottom={`${formatNumber(price ?? 0)}원`}
      {...CALCULATION_RESULT_ITEM_STYLES}
    />
  );
};

const SavingProductItem = ({ product }: { product: SavingsProduct }) => {
  const SAVING_PRODUCT_ITEM_STYLES = {
    topProps: { fontSize: 16, fontWeight: 'bold', color: colors.grey900 },
    middleProps: { fontSize: 14, color: colors.blue600, fontWeight: 'medium' },
    bottomProps: { fontSize: 13, color: colors.grey600 },
  } as const;
  return (
    <ListRow.Texts
      type="3RowTypeA"
      top={product.name}
      middle={`연 이자율: ${product.annualRate}%`}
      bottom={`${formatNumber(product.minMonthlyAmount)}원 ~ ${formatNumber(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
      {...SAVING_PRODUCT_ITEM_STYLES}
    />
  );
};
