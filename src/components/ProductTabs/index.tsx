import { useState, useEffect } from 'react';
import { Tab } from 'tosslib';
import { SavingsProduct, ProductTabs as ProductTabsType } from './types';
import { fetchSavingsProducts } from './api';
import { ProductList } from './ProductList';
import { Results } from './Results';

type ProductTabsProps = {
  targetAmount: string;
  monthlyAmount: string;
  savingTerms: number;
  selectedProduct: SavingsProduct | null;
  onProductSelect: (product: SavingsProduct) => void;
  expectedProfit: number;
  diffAmount: number;
  recommendMonthlyPayment: number;
};

export function ProductTabs({
  targetAmount,
  monthlyAmount,
  savingTerms,
  selectedProduct,
  onProductSelect,
  expectedProfit,
  diffAmount,
  recommendMonthlyPayment,
}: ProductTabsProps) {
  const [selectedTab, setSelectedTab] = useState<ProductTabsType>('products');
  const [products, setProducts] = useState<SavingsProduct[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchSavingsProducts();
        setProducts(data);
      } catch (e) {
        console.error('Failed to fetch products:', e);
      }
    };

    loadProducts();
  }, []);

  const hasAllValues = targetAmount && monthlyAmount && savingTerms;
  const filteredProducts = hasAllValues
    ? products.filter(product => {
        return (
          product.availableTerms === savingTerms &&
          Number(monthlyAmount) <= product.maxMonthlyAmount &&
          Number(monthlyAmount) >= product.minMonthlyAmount
        );
      })
    : products;

  return (
    <>
      <Tab onChange={value => setSelectedTab(value as ProductTabsType)}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === 'products' ? (
        <ProductList products={filteredProducts} selectedProduct={selectedProduct} onProductSelect={onProductSelect} />
      ) : (
        <Results
          selectedProduct={selectedProduct}
          expectedProfit={expectedProfit}
          diffAmount={diffAmount}
          recommendMonthlyPayment={recommendMonthlyPayment}
          filteredProducts={filteredProducts}
          onProductSelect={onProductSelect}
        />
      )}
    </>
  );
}
