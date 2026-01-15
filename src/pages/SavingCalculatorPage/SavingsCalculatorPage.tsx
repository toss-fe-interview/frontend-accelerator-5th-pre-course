import { useQuery } from '@tanstack/react-query';
import { isSuitableSavingProduct, SavingProduct } from 'models/SavingProduct';
import { useState } from 'react';
import { Border, http, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing } from 'tosslib';
import { SavingProductList } from './components/SavingProductList';
import { CalculationResult } from './components/CalculationResult';
import { NavigationTab } from 'components/NavigationTab';
import { PriceTextField } from 'components/PriceTextField';
import { useSavingCalculationParams } from './hooks/useSavingCalculationParams';

const SELECT_TERM_OPTIONS = [
  { value: 6, label: '6개월' },
  { value: 12, label: '12개월' },
  { value: 24, label: '24개월' },
];

export function SavingsCalculatorPage() {
  const { calculationParams, updateCalculationParams } = useSavingCalculationParams();
  const { targetAmount, monthlyPayment, term } = calculationParams;

  const [selectedSavingProduct, setSelectedSavingProduct] = useState<SavingProduct | null>(null);

  const { data: savingsProducts = [] } = useQuery({
    queryKey: ['savings-products'],
    queryFn: () => http.get<SavingProduct[]>('/api/savings-products'),
    select: data =>
      data
        .filter(product => isSuitableSavingProduct(product, monthlyPayment, term))
        .sort((a, b) => b.annualRate - a.annualRate),
  });

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <PriceTextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        value={targetAmount}
        onChange={value => updateCalculationParams({ targetAmount: value })}
      />
      <Spacing size={16} />
      <PriceTextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        value={monthlyPayment}
        onChange={value => updateCalculationParams({ monthlyPayment: value })}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={term}
        onChange={value => updateCalculationParams({ term: value })}
      >
        {SELECT_TERM_OPTIONS.map(option => (
          <SelectBottomSheet.Option key={option.value} value={option.value}>
            {option.label}
          </SelectBottomSheet.Option>
        ))}
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <NavigationTab
        tabs={[
          {
            value: 'products',
            label: '적금 상품',
            renderContent: () => (
              <SavingProductList
                savingsProducts={savingsProducts}
                selectedSavingProduct={selectedSavingProduct}
                selectSavingProduct={product => setSelectedSavingProduct(product)}
              />
            ),
          },
          {
            value: 'results',
            label: '계산 결과',
            renderContent: () => (
              <div>
                <Spacing size={8} />
                {selectedSavingProduct ? (
                  <CalculationResult
                    selectedSavingProduct={selectedSavingProduct}
                    calculationParams={calculationParams}
                  />
                ) : (
                  <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
                )}

                <Spacing size={8} />
                <Border height={16} />
                <Spacing size={8} />

                <ListHeader
                  title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
                />
                <Spacing size={12} />
                <SavingProductList
                  savingsProducts={savingsProducts.slice(0, 2) ?? []}
                  selectedSavingProduct={selectedSavingProduct}
                  selectSavingProduct={product => setSelectedSavingProduct(product)}
                />
                <Spacing size={40} />
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
