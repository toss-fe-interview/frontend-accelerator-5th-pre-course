import { useMemo, useState } from 'react';
import { Border, SelectBottomSheet, Spacing, Tab, TextField, ListRow } from 'tosslib';
import CalculationResult from './CalculationResult';
import ProductList from './ProductList';
import { ProductItem } from 'types/products';
import { CalculatorForm } from 'types/calculate';
import { getNumericStringOnly } from 'utils/number';
import useProducts from 'hooks/useProducts';
import Product from './ProductItem';
import RecommendProductList from './RecommendProductList';

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
  const calculator = savingCalculator(calculatingData, selectedProduct);
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
          renderItem={product => (
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
              예상수익금액={calculator.getExpectedReturnAmount()}
              목표금액과의차이={calculator.getTargetGapAmount()}
              추천월납입금액={calculator.getRecommendedMonthlyContribution()}
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
            renderItem={recommendedProducts => (
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

function getFilterProductsByInputValue(products: ProductItem[], userInput: CalculatorForm) {
  if (products.length === 0) {
    return [];
  }

  return products
    .filter(product => product.minMonthlyAmount < Number(userInput.monthlyPayment))
    .filter(product => product.maxMonthlyAmount > Number(userInput.monthlyPayment))
    .filter(product => product.availableTerms === userInput.savingPeriod);
}

function savingCalculator(userInput: CalculatorForm, targetProduct?: ProductItem) {
  if (!targetProduct) {
    return {
      getExpectedReturnAmount() {
        return 0;
      },
      getTargetGapAmount() {
        return 0;
      },
      getRecommendedMonthlyContribution() {
        return 0;
      },
    };
  }
  return {
    // 최종 금액 = 월 납입액 * 저축 기간 * (1 + 연이자율 * 0.5)
    getExpectedReturnAmount() {
      return Number(userInput.monthlyPayment) * userInput.savingPeriod * (1 + targetProduct.annualRate * 0.5);
    },
    // 목표 금액과의 차이 = 목표 금액 - 예상 수익 금액
    getTargetGapAmount() {
      return Number(userInput.targetAmount) - this.getExpectedReturnAmount();
    },
    // 월 납입액 = 목표 금액 ÷ (저축 기간 * (1 + 연이자율 * 0.5))
    getRecommendedMonthlyContribution() {
      return Number(userInput.targetAmount) / (userInput.savingPeriod * (1 + targetProduct.annualRate * 0.5));
    },
  };
}

function EmptyContent({ text }: { text: string }) {
  return <ListRow contents={<ListRow.Texts type="1RowTypeA" top={text} />} />;
}
