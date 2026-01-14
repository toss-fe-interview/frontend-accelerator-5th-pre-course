import { useEffect, useState } from 'react';
import { Tab } from 'tosslib';
import { savingsProductsQuery } from '../qeuries/savings-products.query';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { SavingsProduct } from '../models/savings-products.dto';
import { match } from 'ts-pattern';
import { CalculationResult } from './CalculationResult';
import { SavingsCalculatorTab, SavingsFilterForm } from '../types/saving-filter-form';
import { SavingsProducts } from './SavingsProducts';

export function SavingsCalculatorContents({ targetAmount, monthlyPayment, term }: SavingsFilterForm) {
  const { data: savingsProducts } = useSuspenseQuery(savingsProductsQuery);

  const [activeTab, setActiveTab] = useState<SavingsCalculatorTab>('products');
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);

  const handleSelectProduct = (product: SavingsProduct) => {
    setSelectedProduct(prev => (prev?.id === product.id ? null : product));
  };

  useEffect(
    function resetSelectedProductOnSavingFilterFormChange() {
      setSelectedProduct(null);
    },
    [monthlyPayment, term]
  );

  const filteredSavingsProducts = filterSavingsProducts(savingsProducts, monthlyPayment, term);

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
          <>
            <SavingsProducts
              products={filteredSavingsProducts}
              selectedProduct={selectedProduct}
              onSelectProduct={handleSelectProduct}
            />
          </>
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
