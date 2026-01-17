import { Assets, Border, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab } from 'tosslib';
import { CalculationResultItem } from './components/CalculationResultItem';
import { Suspense, useState } from 'react';
import { SavingsProduct } from './api';
import { useCalculatorInputs } from './hooks/useCalculatorInputs';
import { useSavingsProducts } from './hooks/useSavingsProducts';
import { calculateSavingResult } from './util';
import { KorNumInput } from './components/KorNumInput';
import { SavingItem } from './components/SavingItem';

type SelectedTab = 'products' | 'results';

export interface CalculInputs {
  targetAmount: number;
  monthlyAmount: number;
  term: number;
}

export interface CalcSavingResult {
  expectedProfit: number;
  difference: number;
  recommendedMonthly: number;
}

const SelectableMonth = [6, 12, 24];

function SavingsCalculator() {
  const [selectedTab, setSelectedTab] = useState<SelectedTab>('products');
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);

  const { calcInputs, setCalcInputs, deferredInputs } = useCalculatorInputs();
  const { filteredProducts, recommendedProducts } = useSavingsProducts(deferredInputs);
  const calculationResult = calculateSavingResult(selectedProduct, calcInputs);

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />
      {/* 원단위의 입력 값 표출 및 입력값 변경 */}
      <KorNumInput
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        value={calcInputs.targetAmount}
        onChange={value => setCalcInputs({ ...calcInputs, targetAmount: value })}
      />
      <Spacing size={16} />
      {/* 원단위의 입력 값 표출 및 입력값 변경 */}
      <KorNumInput
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        value={calcInputs.monthlyAmount}
        onChange={value => setCalcInputs({ ...calcInputs, monthlyAmount: value })}
      />
      <Spacing size={16} />
      {/* 저축기간 선택 */}
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={calcInputs.term}
        onChange={value => setCalcInputs({ ...calcInputs, term: value })}
      >
        {SelectableMonth.map(month => (
          <SelectBottomSheet.Option key={month} value={month}>
            {month}개월
          </SelectBottomSheet.Option>
        ))}
      </SelectBottomSheet>
      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />
      <Tab onChange={value => setSelectedTab(value as SelectedTab)}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>
      {selectedTab === 'products' &&
        filteredProducts.map(product => {
          const isSelected = selectedProduct?.id === product.id;
          return (
            <ListRow
              key={product.id}
              contents={<SavingItem product={product} />}
              right={isSelected && <Assets.Icon name="icon-check-circle-green" />}
              onClick={() => setSelectedProduct(product)}
            />
          );
        })}
      {selectedTab === 'results' && (
        <>
          <Spacing size={8} />
          {(() => {
            if (calculationResult === null) {
              return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
            }
            return (
              <>
                <ListRow
                  contents={<CalculationResultItem label="예상 수익 금액" value={calculationResult.expectedProfit} />}
                />
                <ListRow
                  contents={<CalculationResultItem label="목표 금액과의 차이" value={calculationResult.difference} />}
                />
                <ListRow
                  contents={
                    <CalculationResultItem label="추천 월 납입액" value={calculationResult.recommendedMonthly} />
                  }
                />
              </>
            );
          })()}
          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />
          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />
          {recommendedProducts.map(product => (
            <ListRow key={product.id} contents={<SavingItem product={product} />} />
          ))}
          <Spacing size={40} />
        </>
      )}
    </>
  );
}

function SavingsCalculatorLoading() {
  return (
    <div>
      <p>적금 목록 불러오는중입니다...</p>
    </div>
  );
}

export function SavingsCalculatorPage() {
  return (
    <Suspense fallback={<SavingsCalculatorLoading />}>
      <SavingsCalculator />
    </Suspense>
  );
}
