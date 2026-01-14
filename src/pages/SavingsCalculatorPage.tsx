import { ErrorBoundary, Suspense } from '@suspensive/react';
import ErrorFallback from 'components/ErrorFallback';
import SuspenseFallback from 'components/SuspenseFallback';
import SavingsInputs from 'features/savings/components/SavingsInputs';
import SavingsProductList from 'features/savings/components/SavingsProductList';
import { useSuspenseSavingsProducts } from 'features/savings/hooks/quries/useSuspenseSavingsProducts';
import useFilteredSavingsProducts from 'features/savings/hooks/useFilteredSavingsProducts';
import { SavingsValues } from 'features/savings/types/savingsValues';
import { SavingsTabs } from 'features/savings/types/tabs';
import { parseNumberInput } from 'features/savings/utils/parse/number';
import { ChangeEvent, useState } from 'react';
import { Border, NavigationBar, Spacing, Tab } from 'tosslib';

export function SavingsCalculatorPage() {
  const [savingsValues, setSavingsValues] = useState<SavingsValues>({
    targetAmount: 0,
    monthlyPaymentAmount: 0,
    savingsPeriod: 6,
  });
  const [selectedTab, setSelectedTab] = useState<SavingsTabs>('products');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { data: savingsProducts } = useSuspenseSavingsProducts();

  const filteredSavingsProducts = useFilteredSavingsProducts(
    savingsProducts,
    savingsValues.monthlyPaymentAmount,
    savingsValues.savingsPeriod
  );

  const handleChagneTargetAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseNumberInput(e.target.value);

    setSavingsValues(prev => ({
      ...prev,
      targetAmount: newValue,
    }));
  };

  const handleChagneMonthlyPaymentAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseNumberInput(e.target.value);

    setSavingsValues(prev => ({
      ...prev,
      monthlyPaymentAmount: newValue,
    }));
  };

  const handleChangeSavingsPeriod = (newValue: number) => {
    setSavingsValues(prev => ({
      ...prev,
      savingsPeriod: newValue,
    }));
  };

  const changeSelectedProduct = (newValue: string) => {
    setSelectedProductId(newValue);
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <SavingsInputs
        savingsValues={savingsValues}
        onChangeTargetAmount={handleChagneTargetAmount}
        onChangeMonthlyPaymentAmount={handleChagneMonthlyPaymentAmount}
        onChangeSavingsPeriod={handleChangeSavingsPeriod}
      />

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
        <Suspense fallback={<SuspenseFallback />}>
          {selectedTab === 'products' ? (
            <SavingsProductList
              savingsProducts={filteredSavingsProducts}
              selectedProductId={selectedProductId}
              changeSelectedProduct={changeSelectedProduct}
              clickable
            />
          ) : (
            <SavingsProductList savingsProducts={filteredSavingsProducts} selectedProductId={selectedProductId} />
          )}
        </Suspense>
      </ErrorBoundary>

      {/* 아래는 계산 결과 탭 내용이에요. 계산 결과 탭을 구현할 때 주석을 해제해주세요. */}
      {/* <Spacing size={8} />

      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`1,000,000원`}
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
            bottom={`-500,000원`}
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
            bottom={`100,000원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      <ListRow
        contents={
          <ListRow.Texts
            type="3RowTypeA"
            top={'기본 정기적금'}
            topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
            middle={`연 이자율: 3.2%`}
            middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
            bottom={`100,000원 ~ 500,000원 | 12개월`}
            bottomProps={{ fontSize: 13, color: colors.grey600 }}
          />
        }
        onClick={() => {}}
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="3RowTypeA"
            top={'고급 정기적금'}
            topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
            middle={`연 이자율: 2.8%`}
            middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
            bottom={`50,000원 ~ 1,000,000원 | 24개월`}
            bottomProps={{ fontSize: 13, color: colors.grey600 }}
          />
        }
        onClick={() => {}}
      />

      <Spacing size={40} /> */}
      {/* 아래는 사용자가 적금 상품을 선택하지 않고 계산 결과 탭을 선택했을 때 출력해주세요. */}
      {/* <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} /> */}
    </>
  );
}
