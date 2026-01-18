import { Border, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import { SavingsProduct } from './types/types';
import { useState } from 'react';

import { formatCurrency } from './lib/formatCurrency';
import { extractNumbers } from './lib/extractNumbers';
import { SavingsCalculationSummary } from './components/SavingsCalculationSummary';
import { SavingsProductItem } from './components/SavingsProductItem';
import {
  calculateDifference,
  calculateExpectedAmount,
  calculateRecommendedMonthlyAmount,
} from './utils/savingsCalculations';
import { isProductMatchingInput } from './utils/savingsProductFilters';
import { getTopProductsByRate } from './utils/productSorting';
import { useSavingsProducts } from './hooks/useSavingsProducts';

export function SavingsCalculatorPage() {
  const [savingsInput, setSavingsInput] = useState({
    targetAmount: '',
    monthlyAmount: '',
    savingsTerm: 12,
  });
  const [savingsProductTab, setSavingsProductTab] = useState<'products' | 'results'>('products');
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);

  const { data: savingsProducts = [], isLoading, isError } = useSavingsProducts();

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={savingsInput.targetAmount && formatCurrency(Number(savingsInput.targetAmount))}
        onChange={e => setSavingsInput({ ...savingsInput, targetAmount: extractNumbers(e.target.value) })}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={savingsInput.monthlyAmount && formatCurrency(Number(savingsInput.monthlyAmount))}
        onChange={e => setSavingsInput({ ...savingsInput, monthlyAmount: extractNumbers(e.target.value) })}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsInput.savingsTerm}
        onChange={value => setSavingsInput({ ...savingsInput, savingsTerm: Number(value) })}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSavingsProductTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={savingsProductTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={savingsProductTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {savingsProductTab === 'products' && (
        <>
          {isLoading ? (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="불러오는 중..." />} />
          ) : isError ? (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품 정보를 불러오지 못했습니다." />} />
          ) : (
            savingsProducts
              .filter(product => isProductMatchingInput(product, savingsInput))
              .map(product => {
                const isSelected = selectedSavingsProduct?.id === product.id;
                return (
                  <SavingsProductItem
                    key={product.id}
                    product={product}
                    onClick={() => setSelectedSavingsProduct(isSelected ? null : product)}
                    isSelected={isSelected}
                  />
                );
              })
          )}
        </>
      )}

      {savingsProductTab === 'results' && (
        <>
          <Spacing size={8} />
          {selectedSavingsProduct ? (
            <>
              <SavingsCalculationSummary
                label="예상 수익 금액"
                amount={calculateExpectedAmount({
                  monthlyAmount: Number(savingsInput.monthlyAmount),
                  savingsTerm: savingsInput.savingsTerm,
                  annualRate: selectedSavingsProduct.annualRate,
                })}
              />
              <SavingsCalculationSummary
                label="목표 금액과의 차이"
                amount={calculateDifference({
                  targetAmount: Number(savingsInput.targetAmount),
                  monthlyAmount: Number(savingsInput.monthlyAmount),
                  savingsTerm: savingsInput.savingsTerm,
                  annualRate: selectedSavingsProduct.annualRate,
                })}
              />
              <SavingsCalculationSummary
                label="추천 월 납입 금액"
                amount={calculateRecommendedMonthlyAmount({
                  targetAmount: Number(savingsInput.targetAmount),
                  savingsTerm: savingsInput.savingsTerm,
                  annualRate: selectedSavingsProduct.annualRate,
                })}
              />
            </>
          ) : (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          )}

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />
          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          {isLoading ? (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="불러오는 중..." />} />
          ) : isError ? (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="추천 상품을 불러오지 못했습니다." />} />
          ) : (
            getTopProductsByRate(
              savingsProducts.filter(p => isProductMatchingInput(p, savingsInput)),
              2
            ).map(product => {
              const isSelected = selectedSavingsProduct?.id === product.id;
              return (
                <SavingsProductItem
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedSavingsProduct(isSelected ? null : product)}
                  isSelected={isSelected}
                />
              );
            })
          )}

          <Spacing size={40} />
        </>
      )}
    </>
  );
}
