import { useState } from 'react';
import { Border, ListHeader, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';

import { CalculationResultItem } from 'components/CalculationResultItem';
import { SavingsProductListItem } from 'components/SavingsProductListItem';
import { EmptyListItem } from 'components/common/EmptyListItem';
import { useSavingsProducts } from 'hooks/queries/useSavingsProducts';
import { SavingsCalculatorFormState } from 'types/SavingsCalculatorFormState';
import {
  calculateDifferenceAmount,
  calculateFinalAmount,
  calculateRecommendedMonthlyAmount,
} from 'utils/calculationUtil';
import { filterSavingsProduct } from 'utils/filterSavingsProduct';
import { formatTextFieldValue } from 'utils/formatTextFieldValue';
import { sanitizeAmount } from 'utils/sanitizeAmount';
import { validateAmount } from 'utils/validateAmount';

/**
 * 개선할 부분
 * 1. form 관리를 단순한 object 형태보다는 더 효율적으로 관리할 수 있도록 개발하면 좋을 것 같습니다.
 * 2. state를 필요한 영역으로 내릴 수 있습니다.
 */
export function SavingsCalculatorPage() {
  const { data: savingsProducts } = useSavingsProducts();
  const [formState, setFormState] = useState<SavingsCalculatorFormState>({
    targetAmount: 0,
    monthlyAmount: 0,
    term: 12,
  });
  const [selectedSavingsProductId, setSelectedSavingsProductId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'products' | 'results'>('products');

  const filteredSavingsProducts = savingsProducts.filter(savingsProduct =>
    filterSavingsProduct({ savingsProduct, formState })
  );

  const recommendedSavingsProducts = [...filteredSavingsProducts]
    .sort((a, b) => b.annualRate - a.annualRate)
    .slice(0, 2);

  const selectedSavingsProduct = filteredSavingsProducts.find(
    savingsProduct => savingsProduct.id === selectedSavingsProductId
  );

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      {/* 계산기 form 영역 */}
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={formatTextFieldValue(formState.targetAmount)}
        onChange={e => {
          const value = e.target.value;
          if (value === '') {
            setFormState({ ...formState, targetAmount: 0 });
            return;
          }
          const targetAmount = sanitizeAmount(value);
          if (validateAmount(targetAmount)) {
            setFormState({ ...formState, targetAmount });
          }
        }}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={formatTextFieldValue(formState.monthlyAmount)}
        onChange={e => {
          const value = e.target.value;
          if (value === '') {
            setFormState({ ...formState, monthlyAmount: 0 });
            return;
          }
          const monthlyAmount = sanitizeAmount(value);
          if (validateAmount(monthlyAmount)) {
            setFormState({ ...formState, monthlyAmount });
          }
        }}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={formState.term}
        onChange={value => setFormState({ ...formState, term: Number(value) })}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      {/* Tab 버튼 영역 */}
      <Tab onChange={tab => setSelectedTab(tab as 'products' | 'results')}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {/* 적금 상품 리스트 영역 */}
      {selectedTab === 'products' && (
        <>
          {filteredSavingsProducts.length > 0 ? (
            <>
              {filteredSavingsProducts.map(savingsProduct => {
                const isSelected = selectedSavingsProductId === savingsProduct.id;
                return (
                  <SavingsProductListItem
                    key={savingsProduct.id}
                    savingsProduct={savingsProduct}
                    isSelected={isSelected}
                    handleSelectSavingsProduct={savingsProduct =>
                      setSelectedSavingsProductId(savingsProduct?.id || null)
                    }
                  />
                );
              })}
            </>
          ) : (
            <EmptyListItem message="적합한 적금 상품이 없습니다." />
          )}
        </>
      )}

      {/* 아래는 계산 결과 탭 내용이에요. 계산 결과 탭을 구현할 때 주석을 해제해주세요. */}
      {selectedTab === 'results' && (
        <>
          <Spacing size={8} />

          {selectedSavingsProduct ? (
            (() => {
              const { targetAmount, monthlyAmount, term } = formState;
              const annualRate = selectedSavingsProduct.annualRate;
              const finalAmount = calculateFinalAmount({ monthlyAmount, term, annualRate });
              const differenceAmount = calculateDifferenceAmount({ targetAmount, finalAmount });
              const recommendedMonthlyAmount = calculateRecommendedMonthlyAmount({
                targetAmount,
                term,
                annualRate,
              });
              return (
                <>
                  <CalculationResultItem label="예상 수익 금액" amount={finalAmount} />
                  <CalculationResultItem label="목표 금액과의 차이" amount={differenceAmount} />
                  <CalculationResultItem label="추천 월 납입 금액" amount={recommendedMonthlyAmount} />
                </>
              );
            })()
          ) : (
            <EmptyListItem message="상품을 선택해주세요." />
          )}

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          {recommendedSavingsProducts.length > 0 ? (
            <>
              {recommendedSavingsProducts.map(savingsProduct => {
                const isSelected = selectedSavingsProductId === savingsProduct.id;
                return (
                  <SavingsProductListItem
                    key={savingsProduct.id}
                    savingsProduct={savingsProduct}
                    isSelected={isSelected}
                    handleSelectSavingsProduct={savingsProduct =>
                      setSelectedSavingsProductId(savingsProduct?.id || null)
                    }
                  />
                );
              })}
            </>
          ) : (
            <EmptyListItem message="적합한 추천 상품이 없습니다." />
          )}

          <Spacing size={40} />
        </>
      )}
    </>
  );
}
