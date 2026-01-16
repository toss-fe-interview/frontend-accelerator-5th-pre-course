import { Border, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { useMemo, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { SavingsInputForm } from 'components/SavingsInputForm';
import { CalculationResult } from 'components/CalculationResult';
import { SavingsInput, SavingsProduct } from 'type';
import { ProductList } from 'components/ProductList';
import { savingsProductsQuery } from 'apis/savingsProduct';

export function SavingsCalculatorPage() {
  const { data: savingsProducts } = useSuspenseQuery(savingsProductsQuery());
  const [savingsInput, setSavingsInput] = useState<SavingsInput>({
    goalAmount: 0,
    monthlyAmount: 0,
    term: 0,
  });
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);

  const [selectTab, setSelectTab] = useState<'products' | 'results'>('products');

  const filteredSavingsProducts = useMemo(() => {
    const filteredByMonthlyAmount = savingsProducts.filter(product => {
      return (
        product.minMonthlyAmount <= savingsInput.monthlyAmount && product.maxMonthlyAmount >= savingsInput.monthlyAmount
      );
    });

    const filteredByTerm = filteredByMonthlyAmount.filter(product => {
      return product.availableTerms === savingsInput.term;
    });

    return filteredByTerm;
  }, [savingsProducts, savingsInput]);

  const hasValidInput = savingsInput.term && savingsInput.monthlyAmount;

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsInputForm savingsInput={savingsInput} setSavingsInput={setSavingsInput} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSelectTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={selectTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      <Spacing size={8} />
      {hasValidInput ? (
        <>
          {selectTab === 'products' && (
            <ProductList
              filteredSavingsProducts={filteredSavingsProducts}
              selectedSavingsProduct={selectedSavingsProduct}
              setSelectedSavingsProduct={setSelectedSavingsProduct}
            />
          )}
          {selectTab === 'results' && (
            <CalculationResult
              selectedSavingsProduct={selectedSavingsProduct}
              savingsInput={savingsInput}
              filteredSavingsProducts={filteredSavingsProducts}
            />
          )}
        </>
      ) : (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="먼저 저축 기간과 월 납입 금액을 입력해주세요." />} />
      )}
      <Spacing size={40} />
    </>
  );
}
