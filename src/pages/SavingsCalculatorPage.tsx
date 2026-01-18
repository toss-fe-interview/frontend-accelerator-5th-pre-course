import { ErrorBoundary, Suspense } from '@suspensive/react';
import ErrorFallback from 'components/ErrorFallback';
import Loading from 'components/Loading';
import LabeledNumberInput from 'features/savings/components/LabeledNumberInput';
import { savingsProductsQueryOptions } from 'features/savings/hooks/quries/savingsProducts.query';
import { SavingsValues } from 'features/savings/types/savingsValues';
import { SavingsTabs } from 'features/savings/types/tabs';
import { calculateSavingsResults } from 'features/savings/utils/calculation/savings';
import { filterSavings, recommendSavings } from 'features/savings/utils/savingsRules';
import { useState } from 'react';
import { Assets, Border, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab } from 'tosslib';
import ProductItem from 'features/savings/components/ProductItem';
import { formatNumberWithComma } from 'features/savings/utils/format/number';
import ResultItem from 'features/savings/components/ResultItem';
import { useSuspenseQuery } from '@tanstack/react-query';
import { SAVINGS_VALUES_DEFAULTS } from 'features/savings/constants/default';

export function SavingsCalculatorPage() {
  const [savingsValues, setSavingsValues] = useState<SavingsValues>({
    targetAmount: SAVINGS_VALUES_DEFAULTS.targetAmount,
    monthlyPaymentAmount: SAVINGS_VALUES_DEFAULTS.monthlyPaymentAmount,
    savingsPeriod: SAVINGS_VALUES_DEFAULTS.savingsPeriod,
  });
  const [selectedTab, setSelectedTab] = useState<SavingsTabs>('products');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { data: savingsProducts } = useSuspenseQuery(savingsProductsQueryOptions);
  const filteredSavingsProducts = filterSavings(savingsProducts, {
    monthlyPaymentAmount: savingsValues.monthlyPaymentAmount,
    savingsPeriod: savingsValues.savingsPeriod,
  });

  const selectedProduct = filteredSavingsProducts.find(product => product.id === selectedProductId);

  const savingsCalculations = selectedProduct ? calculateSavingsResults(selectedProduct, savingsValues) : null;

  const isProductNotSelected = !selectedProductId || !selectedProduct || !savingsCalculations;

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <LabeledNumberInput
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        unit="원"
        value={savingsValues.targetAmount}
        onChange={(newValue: number) => {
          setSavingsValues(prev => ({
            ...prev,
            targetAmount: newValue,
          }));
        }}
      />
      <Spacing size={16} />
      <LabeledNumberInput
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        unit="원"
        value={savingsValues.monthlyPaymentAmount}
        onChange={(newValue: number) => {
          setSavingsValues(prev => ({
            ...prev,
            monthlyPaymentAmount: newValue,
          }));
        }}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsValues.savingsPeriod}
        onChange={(newValue: number) => {
          setSavingsValues(prev => ({
            ...prev,
            savingsPeriod: newValue,
          }));
        }}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={18}>18개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab
        onChange={(newValue: string) => {
          setSelectedTab(newValue as SavingsTabs);
        }}
      >
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      <ErrorBoundary fallback={ErrorFallback}>
        <Suspense fallback={<Loading />}>
          {selectedTab === 'products' ? (
            filteredSavingsProducts.map(savingsProduct => {
              const isProductSelected = savingsProduct.id === selectedProductId;

              return (
                <ListRow
                  key={savingsProduct.id}
                  contents={
                    <ProductItem
                      title={savingsProduct.name}
                      highlight={`연 이자율: ${savingsProduct.annualRate}%`}
                      description={`${formatNumberWithComma(savingsProduct.minMonthlyAmount)}원 ~ ${formatNumberWithComma(savingsProduct.maxMonthlyAmount)}원 | ${savingsProduct.availableTerms}개월`}
                    />
                  }
                  right={isProductSelected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
                  onClick={() => {
                    setSelectedProductId(savingsProduct.id);
                  }}
                />
              );
            })
          ) : (
            <>
              <Spacing size={8} />

              <>
                {isProductNotSelected ? (
                  <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
                ) : (
                  <>
                    <ListRow
                      contents={
                        <ResultItem
                          label="예상 수익 금액"
                          value={`${formatNumberWithComma(savingsCalculations.estimatedEarnings)}원`}
                        />
                      }
                    />
                    <ListRow
                      contents={
                        <ResultItem
                          label="목표 금액과의 차이"
                          value={`${formatNumberWithComma(savingsCalculations.diffWithTargetAmount)}원`}
                        />
                      }
                    />
                    <ListRow
                      contents={
                        <ResultItem
                          label="추천 월 납입 금액"
                          value={`${formatNumberWithComma(savingsCalculations.recommendedMonthlyPayment)}원`}
                        />
                      }
                    />
                  </>
                )}
              </>

              <Spacing size={8} />
              <Border height={16} />
              <Spacing size={8} />

              <ListHeader
                title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
              />
              <Spacing size={12} />

              <>
                {recommendSavings(filteredSavingsProducts, 2).map(savingsProduct => {
                  const isProductSelected = savingsProduct.id === selectedProductId;

                  return (
                    <ListRow
                      key={savingsProduct.id}
                      contents={
                        <ProductItem
                          title={savingsProduct.name}
                          highlight={`연 이자율: ${savingsProduct.annualRate}%`}
                          description={`${formatNumberWithComma(savingsProduct.minMonthlyAmount)}원 ~ ${formatNumberWithComma(savingsProduct.maxMonthlyAmount)}원 | ${savingsProduct.availableTerms}개월`}
                        />
                      }
                      right={isProductSelected ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
                    />
                  );
                })}
              </>

              <Spacing size={40} />
            </>
          )}
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
