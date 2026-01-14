import { useEffect, useState } from 'react';
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

  const handleSelectProduct = (product: SavingsProduct) => {
    setSelectedProduct(prev => (prev?.id === product.id ? null : product));
  };

  // @note: 입력 폼 달라졌는데 이전에 선택한 상품이 유지되면 올바른 결과가 나오지 않아 초기화
  useEffect(
    function resetSelectedProductOnSavingFilterFormChange() {
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
