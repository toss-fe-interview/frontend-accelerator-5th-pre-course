import { Border, NavigationBar, Spacing, Tab, http, isHttpError } from 'tosslib';
import { useEffect, useMemo, useState } from 'react';
import SavingsInputForm from 'components/SavingsInputForm';
import SavingsProductItem from 'components/SavingsProductItem';
import CalculationResult from 'components/CalculationResult';

export type SavingsProduct = {
  id: string;
  name: string;
  annualRate: number;
  // 최소 월 납입액
  minMonthlyAmount: number;
  // 최대 월 납입액
  maxMonthlyAmount: number;
  // 저축 기간
  availableTerms: number;
};

export type SavingsInput = {
  goalAmount: string;
  monthlyAmount: string;
  term: number;
};

export function SavingsCalculatorPage() {
  const [savingsProducts, setSavingsProducts] = useState<SavingsProduct[]>([]);

  const [savingsInput, setSavingsInput] = useState<SavingsInput>({
    goalAmount: '',
    monthlyAmount: '',
    term: 0,
  });

  // 선택한 적금 상품
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);

  const [selectTab, setSelectTab] = useState<'products' | 'results'>('products');

  // 필터링 조건에 맞게 상품 목록 필터링
  const filteredSavingsProducts = useMemo(() => {
    // 월 납입액 필터링
    const filteredByMonthlyAmount = savingsProducts.filter(product => {
      return (
        product.minMonthlyAmount <= Number(savingsInput.monthlyAmount) &&
        product.maxMonthlyAmount >= Number(savingsInput.monthlyAmount)
      );
    });

    // 저축 기간 필터링
    const filteredByTerm = filteredByMonthlyAmount.filter(product => {
      return product.availableTerms === savingsInput.term;
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
      {selectTab === 'products' && (
        <>
          {filteredSavingsProducts.map(product => (
            <SavingsProductItem
              key={product.id}
              product={product}
              selected={selectedSavingsProduct?.id === product.id}
              onClick={() => setSelectedSavingsProduct(product)}
            />
          ))}
        </>
      )}
      {selectTab === 'results' && <CalculationResult selectedSavingsProduct={selectedSavingsProduct} />}

      <Spacing size={40} />
    </>
  );
}
