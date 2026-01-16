import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Assets, Border, ListHeader, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { savingsProductsQueries } from './api/queries';
import CalculationResult from './components/CalculationResult';
import { MonthlyAmountInput, SavingTermsSelect, TargetAmountInput } from './components/CalculatorFields';
import SavingsProductInfo from './components/SavingsProductInfo';
import { useCalculatorParams } from './hooks/useCalculatorParams';
import { useSelectProductParams } from './hooks/useSelectProductParams';
import { byHighestAnnualRate, matchesPaymentRange, matchesPeriod } from './utils/productFilters';

const TABS_CONFIG = {
  products: '적금 상품',
  results: '계산 결과',
} as const;

type TabKey = keyof typeof TABS_CONFIG;
const isValidTabKey = (tab: string): tab is TabKey => tab in TABS_CONFIG;

export default function SavingsCalculatorPage() {
  const { data: products } = useSuspenseQuery(savingsProductsQueries.listQuery());

  const { targetAmount, monthlyAmount, savingTerms, setCalculatorParams } = useCalculatorParams();
  const { selectedProductId, setSelectedProductId } = useSelectProductParams();
  const [currentTab, setCurrentTab] = useState<TabKey>('products');

  const filteredProducts = products.filter(matchesPaymentRange(monthlyAmount)).filter(matchesPeriod(savingTerms));
  const recommendedProducts = filteredProducts.sort(byHighestAnnualRate).slice(0, 2);
  const selectedProduct = products.find(product => product.id === selectedProductId);

  const handleTabChange = (tab: string) => {
    if (isValidTabKey(tab)) {
      setCurrentTab(tab);
    }
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TargetAmountInput value={targetAmount} onChange={value => setCalculatorParams({ targetAmount: value })} />
      <Spacing size={16} />
      <MonthlyAmountInput value={monthlyAmount} onChange={value => setCalculatorParams({ monthlyAmount: value })} />
      <Spacing size={16} />
      <SavingTermsSelect value={savingTerms} onChange={value => setCalculatorParams({ savingTerms: value })} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={handleTabChange}>
        {Object.entries(TABS_CONFIG).map(([tab, label]) => (
          <Tab.Item key={tab} value={tab} selected={currentTab === tab}>
            {label}
          </Tab.Item>
        ))}
      </Tab>
      {(() => {
        switch (currentTab) {
          case 'products':
            return filteredProducts.length > 0 ? (
              filteredProducts.map(product => {
                const isSelected = selectedProductId === product.id;
                return (
                  <ListRow
                    key={product.id}
                    contents={<SavingsProductInfo product={product} />}
                    right={isSelected ? <CheckedCircleIcon /> : null}
                    onClick={() => setSelectedProductId(product.id)}
                  />
                );
              })
            ) : (
              <EmptyProductList />
            );
          case 'results':
            return (
              <>
                <Spacing size={8} />
                {selectedProduct ? <CalculationResult product={selectedProduct} /> : <EmptyProductSelection />}

                <Spacing size={8} />
                <Border height={16} />
                <Spacing size={8} />

                <ListHeader
                  title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
                />
                <Spacing size={12} />
                {recommendedProducts.length > 0 ? (
                  recommendedProducts.map(product => {
                    const isSelected = selectedProductId === product.id;
                    return (
                      <ListRow
                        key={product.id}
                        contents={<SavingsProductInfo product={product} />}
                        right={isSelected ? <CheckedCircleIcon /> : null}
                        onClick={() => setSelectedProductId(product.id)}
                      />
                    );
                  })
                ) : (
                  <EmptyProductList />
                )}
                <Spacing size={40} />
              </>
            );
          default:
            return null;
        }
      })()}
    </>
  );
}

function CheckedCircleIcon() {
  return <Assets.Icon name="icon-check-circle-green" />;
}

function EmptyProductList() {
  return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없습니다." />} />;
}

function EmptyProductSelection() {
  return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
}
