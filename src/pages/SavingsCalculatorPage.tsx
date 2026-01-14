import { Border, ListRow, NavigationBar, Spacing, Tab, http, isHttpError } from 'tosslib';
import { useEffect, useMemo, useState } from 'react';
import { SavingsInputForm } from 'components/SavingsInputForm';
import { CalculationResult } from 'components/CalculationResult';
import { SavingsProduct, SavingsInput } from 'type';
import { ProductList } from 'components/ProductList';

export function SavingsCalculatorPage() {
  const [savingsProducts, setSavingsProducts] = useState<SavingsProduct[]>([]);
  const [savingsInput, setSavingsInput] = useState<SavingsInput>({
    goalAmount: '',
    monthlyAmount: '',
    term: 0,
  });
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);

  const [selectTab, setSelectTab] = useState<'products' | 'results'>('products');

  const filteredSavingsProducts = useMemo(() => {
    const filteredByMonthlyAmount = savingsProducts.filter(product => {
      return (
        product.minMonthlyAmount <= Number(savingsInput?.monthlyAmount) &&
        product.maxMonthlyAmount >= Number(savingsInput?.monthlyAmount)
      );
    });

    const filteredByTerm = filteredByMonthlyAmount.filter(product => {
      return product.availableTerms === savingsInput?.term;
    });

    return filteredByTerm;
  }, [savingsProducts, savingsInput]);

  useEffect(() => {
    const fetchSavingsProducts = async () => {
      try {
        const response = await http.get<SavingsProduct[]>('/api/savings-products');
        setSavingsProducts(response);
      } catch (error) {
        if (isHttpError(error)) {
          console.error(error.message);
        } else {
          console.error(error);
        }
      }
    };
    fetchSavingsProducts();
  }, []);

  const hasValidInput = savingsInput?.term && savingsInput?.monthlyAmount;

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
