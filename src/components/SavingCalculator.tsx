import { useMemo, useState } from 'react';
import { Border, SelectBottomSheet, Spacing, Tab, TextField, ListRow } from 'tosslib';
import CalculationResult from './CalculationResult';
import ProductList from './ProductList';
import { CalculatorForm } from 'types/calculate';
import { getNumericStringOnly } from 'utils/number';
import useProducts from 'hooks/useProducts';
import Product from './ProductItem';
import RecommendProductList from './RecommendProductList';
import { createSavingCalculator, getFilterProductsByInputValue } from 'feature/product';

type Tabs = (typeof TABS)[keyof typeof TABS];

const TABS = {
  PRODUCT: 'products',
  RESULT: 'results',
} as const;

export default function SavingCalculator() {
  const { products, handleSelectItem } = useProducts();
  const [tab, setTab] = useState<Tabs>('products');
  const [calculatingData, setCalculatingData] = useState<CalculatorForm>({
    targetAmount: '',
    monthlyPayment: '',
    savingPeriod: 12,
  });

  function onChangeTab(tab: Tabs) {
    setTab(tab);
  }

  // 필드에 맞는 값을 업데이트
  function handleChangeField<K extends keyof CalculatorForm>(key: K, value: CalculatorForm[K]) {
    setCalculatingData(prev => ({ ...prev, [key]: value }));
  }

  const filteredProducts = useMemo(
    () => getFilterProductsByInputValue(products, calculatingData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, calculatingData.monthlyPayment, calculatingData.targetAmount, calculatingData.savingPeriod]
  );

  const selectedProduct = filteredProducts.find(product => product.isSelected);
  const savingCalculator = createSavingCalculator(calculatingData, selectedProduct);
  const recommendedProducts = filteredProducts.sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={Number(calculatingData.targetAmount).toLocaleString()}
        onChange={event => {
          const numericValue = getNumericStringOnly(event.target.value);
          handleChangeField('targetAmount', numericValue);
        }}
      />
      <Spacing size={16} />

      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={Number(calculatingData.monthlyPayment).toLocaleString()}
        onChange={event => {
          const numericValue = getNumericStringOnly(event.target.value);
          handleChangeField('monthlyPayment', numericValue);
        }}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={calculatingData.savingPeriod}
        onChange={period => {
          handleChangeField('savingPeriod', period);
        }}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab
        onChange={tab => {
          onChangeTab(tab as Tabs);
        }}
      >
        <Tab.Item value="products" selected={tab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={tab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {tab === TABS.PRODUCT && (
        <ProductList
          items={filteredProducts}
          renderComponent={product => (
            <Product
              product={product}
              isActive={product.isSelected}
              onClick={() => {
                handleSelectItem(product.id);
              }}
            />
          )}
        />
      )}

      {tab === TABS.RESULT && (
        <>
          {selectedProduct ? (
            <CalculationResult
              예상수익금액={savingCalculator.calculate('ExpectedReturnAmount')}
              목표금액과의차이={savingCalculator.calculate('TargetGapAmount')}
              추천월납입금액={savingCalculator.calculate('RecommendedMonthlyContribution')}
            />
          ) : (
            <EmptyContent text="상품을 선택해주세요." />
          )}
          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />
          <Spacing size={40} />
          <RecommendProductList
            items={recommendedProducts}
            renderComponent={recommendedProducts => (
              <Product
                product={recommendedProducts}
                isActive={recommendedProducts.isSelected}
                onClick={() => {
                  handleSelectItem(recommendedProducts.id);
                }}
              />
            )}
          />
        </>
      )}
    </>
  );
}

function EmptyContent({ text }: { text: string }) {
  return <ListRow contents={<ListRow.Texts type="1RowTypeA" top={text} />} />;
}
