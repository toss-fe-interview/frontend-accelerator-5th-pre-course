import { useState, useMemo } from 'react';
import SavingsProductList from 'components/SavingsProductList';
import SavingsTargetForm from 'components/SavingsTargetForm';
import CalculationResult from 'components/CalculationResult';
import { useFilteredProducts } from 'hooks/useFilteredProducts';
import { useSavingProducts } from 'hooks/useSavingsProducts';
import { Border, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { SavingsFormInput } from 'types/savings';

export function SavingsCalculatorPage() {
  const [selectedTab, setSelectedTab] = useState<'productList' | 'calculationResult'>('productList');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SavingsFormInput>({
    targetAmount: 0,
    monthlyAmount: 0,
    terms: 12,
  });

  const { data: products = [], isLoading, isError } = useSavingProducts();

  const filteredProducts = useFilteredProducts(products, formData.monthlyAmount, formData.terms);

  const selectedProduct = useMemo(() => {
    if (!selectedProductId) {
      return null;
    }

    return products.find(product => product.id === selectedProductId) ?? null;
  }, [products, selectedProductId]);

  const renderProductList = () => {
    if (isLoading) {
      return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 불러오는 중입니다..." />} />;
    }
    if (isError) {
      return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 불러오는 중에 오류가 발생했습니다." />} />;
    }
    if (filteredProducts.length === 0) {
      return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없습니다." />} />;
    }
    return (
      <SavingsProductList
        products={filteredProducts}
        selectedProductId={selectedProductId}
        onProductSelect={setSelectedProductId}
      />
    );
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsTargetForm onChange={setFormData} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSelectedTab(value as 'productList' | 'calculationResult')}>
        <Tab.Item value="productList" selected={selectedTab === 'productList'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="calculationResult" selected={selectedTab === 'calculationResult'}>
          계산 결과
        </Tab.Item>
      </Tab>
      {selectedTab === 'productList' ? (
        renderProductList()
      ) : (
        <CalculationResult formData={formData} selectedProduct={selectedProduct} />
      )}
    </>
  );
}
