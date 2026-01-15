import { SavingsProduct } from 'api/savings-products/types';
import { useSavingsProducts } from 'api/savings-products/useSavingsProducts';
import CalculationResult from 'components/savings-products/CalculationResult';
import SavingsProductsList from 'components/savings-products/SavingsProductsList';
import { useMemo, useState } from 'react';
import { Border, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import { formatNumberToKo } from 'utils/formatting';
import { parseFormattedNumber } from 'utils/parse';
import { filterSavingsProducts } from 'utils/savings-filter';

export function SavingsCalculatorPage() {
  const { savingsProducts } = useSavingsProducts();

  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct>();
  const [tabValue, setTabValue] = useState<string>('products');

  const [targetAmount, setTargetAmount] = useState<number>();
  const [monthlyPayment, setMonthlyPayment] = useState<number>();
  const [availableTerms, setAvailableTerms] = useState<number>();

  const hasAllFilterValues = monthlyPayment !== undefined && availableTerms !== undefined && targetAmount !== undefined;

  const filteredProducts = useMemo(() => {
    if (!hasAllFilterValues) {
      return [];
    }

    return filterSavingsProducts(savingsProducts, {
      monthlyPayment,
      availableTerms,
      targetAmount,
    });
  }, [savingsProducts, monthlyPayment, availableTerms, targetAmount, hasAllFilterValues]);

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={formatNumberToKo(targetAmount)}
        onChange={e => setTargetAmount(parseFormattedNumber(e.target.value))}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={formatNumberToKo(monthlyPayment)}
        onChange={e => setMonthlyPayment(parseFormattedNumber(e.target.value))}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={availableTerms}
        onChange={setAvailableTerms}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />
      <Tab onChange={setTabValue}>
        <Tab.Item value="products" selected={tabValue === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={tabValue === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {tabValue === 'products' && (
        <SavingsProductsList
          products={hasAllFilterValues ? filteredProducts : savingsProducts}
          selectedProduct={selectedSavingsProduct && selectedSavingsProduct}
          setSelectedProduct={setSelectedSavingsProduct}
        />
      )}

      {tabValue === 'results' && (
        <CalculationResult
          filteredProducts={filteredProducts}
          targetAmount={targetAmount}
          monthlyPayment={monthlyPayment}
          selectedProduct={selectedSavingsProduct && selectedSavingsProduct}
          setSelectedProduct={setSelectedSavingsProduct}
        />
      )}
    </>
  );
}
