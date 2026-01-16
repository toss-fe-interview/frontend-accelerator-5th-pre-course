import { useQuery } from '@tanstack/react-query';
import { isSuitableSavingProduct, SavingProduct } from 'models/SavingProduct';
import { useState } from 'react';
import { Border, ListRow, NavigationBar, SelectBottomSheet, Spacing } from 'tosslib';
import { SavingProductList } from './components/SavingProductList';
import { CalculationResult } from './components/CalculationResult';
import { NavigationTab } from 'components/NavigationTab';
import { PriceTextField } from 'components/PriceTextField';
import { useSavingCalculationParams } from './hooks/useSavingCalculationParams';
import { RecommendedSavingProductList } from './components/RecommendedSavingProductList';
import { SavingCalculationParams, TERM_OPTIONS } from 'pages/SavingCalculatorPage/types/SavingCalculationParam';
import { savingProductsQuery } from 'apis/savingProductsApi';

export function SavingsCalculatorPage() {
  const { calculationParams, updateCalculationParams } = useSavingCalculationParams();
  const { targetAmount, monthlyPayment, term } = calculationParams;

  const [selectedSavingProduct, setSelectedSavingProduct] = useState<SavingProduct | null>(null);

  const { data: savingsProducts = [] } = useQuery({
    ...savingProductsQuery(),
    select: data =>
      data
        .filter(product => isSuitableSavingProduct(product, monthlyPayment, term))
        .sort((a, b) => b.annualRate - a.annualRate),
  });

  const handleChangeCalculationParams = (params: Partial<SavingCalculationParams>) => {
    updateCalculationParams(params);
    setSelectedSavingProduct(null);
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <PriceTextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        value={targetAmount}
        onChange={value => handleChangeCalculationParams({ targetAmount: value })}
      />
      <Spacing size={16} />
      <PriceTextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        value={monthlyPayment}
        onChange={value => handleChangeCalculationParams({ monthlyPayment: value })}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={term}
        onChange={value => handleChangeCalculationParams({ term: value })}
      >
        {TERM_OPTIONS.map(option => (
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

                <RecommendedSavingProductList
                  savingsProducts={savingsProducts}
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
