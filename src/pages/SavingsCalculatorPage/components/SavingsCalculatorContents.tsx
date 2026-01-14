import { useEffect, useRef, useState } from 'react';
import { Tab } from 'tosslib';
import { savingsProductsQuery } from '../qeuries/savings-products.query';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { SavingsProduct } from '../models/savings-products.dto';
import { match } from 'ts-pattern';
import { CalculationResult } from './CalculationResult';
import { SavingsCalculatorTab, SavingsCalculatorTerm, SavingsFilterForm } from '../types/saving-filter-form';
import { SavingsProducts } from './SavingsProducts';

export function SavingsCalculatorContents({ targetAmount, monthlyPayment, term }: SavingsFilterForm) {
  const { data: savingsProducts } = useSuspenseQuery(savingsProductsQuery);

  const [activeTab, setActiveTab] = useState<SavingsCalculatorTab>('products');
  const { selectedProduct, handleSelectProduct, filteredSavingsProducts } = useSavingsProducts(
    savingsProducts,
    monthlyPayment,
    term
  );

  return (
    <>
      <Tab
        onChange={value => {
          if (isTab(value)) {
            setActiveTab(value);
          }
        }}
      >
        <Tab.Item value="products" selected={activeTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={activeTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {match(activeTab)
        .with('products', () => (
          <SavingsProducts
            products={filteredSavingsProducts}
            selectedProduct={selectedProduct}
            onSelectProduct={handleSelectProduct}
          />
        ))
        .with('results', () => (
          <CalculationResult
            targetAmount={targetAmount}
            monthlyPayment={monthlyPayment}
            term={term}
            selectedProduct={selectedProduct}
            products={filteredSavingsProducts}
            onSelectProduct={handleSelectProduct}
          />
        ))
        .exhaustive()}
    </>
  );
}

// 파일 외부로 뺄지, 아니면 응집도를 위해 해당 파일에 둘지 고민
function useSavingsProducts(products: SavingsProduct[], monthlyPayment: number | null, term: SavingsCalculatorTerm) {
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);
  const prevSelectedRef = useRef<SavingsProduct | null>(null);

  const handleSelectProduct = (product: SavingsProduct) => {
    setSelectedProduct(prev => (prev?.id === product.id ? null : product));
  };

  // @note: 필터 변경 시 알림 표시를 위해 이전 선택 상품 추적
  useEffect(
    function trackPreviousSelection() {
      prevSelectedRef.current = selectedProduct;
    },
    [selectedProduct]
  );

  // @note: 필터 Form 변경 시 선택 초기화 (현재 필터에 없는 상품이 선택되는 상태 방지)
  useEffect(
    function resetSelectedProductOnSavingFilterFormChange() {
      if (prevSelectedRef.current !== null) {
        // TODO: Toast로 변경
        console.log('조건 변경으로 상품 선택이 초기화되었습니다');
      }
      setSelectedProduct(null);
    },
    [monthlyPayment, term]
  );

  const filteredSavingsProducts = filterSavingsProducts(products, monthlyPayment, term);

  return {
    selectedProduct,
    handleSelectProduct,
    filteredSavingsProducts,
  };
}

function filterSavingsProducts(savingsProducts: SavingsProduct[], monthlyPayment: number | null, term: number) {
  return savingsProducts.filter(product => {
    if (monthlyPayment) {
      if (monthlyPayment < product.minMonthlyAmount || product.maxMonthlyAmount < monthlyPayment) {
        return false;
      }
    }

    if (product.availableTerms !== term) {
      return false;
    }

    return true;
  });
}

function isTab(value: string): value is SavingsCalculatorTab {
  return value === 'products' || value === 'results';
}
