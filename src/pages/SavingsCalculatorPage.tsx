import { useSavingsProducts } from 'apis/savings';
import { CalculationResult } from 'components/CalculationResult';
import { ProductList } from 'components/ProductList';
import { SavingsForm } from 'components/SavingsForm';
import { useSavingsCalculator } from 'hooks/useSavingsCalculator';
import { useSavingsForm } from 'hooks/useSavingsForm';
import { useState } from 'react';
import { Border, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';

type TabType = 'products' | 'results';

export function SavingsCalculatorPage() {
  const { data: products, status } = useSavingsProducts();
  const { formData, handleChangeInput } = useSavingsForm();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabType>('products');

  const { filteredProducts, recommendedProducts, selectedProduct, calculationResult } = useSavingsCalculator({
    products,
    formData,
    selectedProductId,
  });

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(prev => (prev === productId ? null : productId));
  };

  const handleChangeTab = (tab: string) => {
    if (tab === 'products' || tab === 'results') {
      setSelectedTab(tab);
    }
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsForm formData={formData} onChangeInput={handleChangeInput} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={handleChangeTab}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>
      {selectedTab === 'products' && (
        <>
          {status === 'pending' && <ListRow contents={<ListRow.Texts type="1RowTypeA" top="로딩 중..." />} />}
          {status === 'error' && (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 불러올 수 없습니다." />} />
          )}
          {status === 'success' && (
            <ProductList
              products={filteredProducts}
              selectedProductId={selectedProductId}
              onSelectProduct={handleSelectProduct}
            />
          )}
        </>
      )}

      {selectedTab === 'results' && (
        <>
          {!selectedProduct ? (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          ) : calculationResult ? (
            <CalculationResult
              expectedAmount={calculationResult.expectedAmount}
              differenceFromTarget={calculationResult.differenceFromTarget}
              recommendedMonthlyAmount={calculationResult.recommendedMonthlyAmount}
              recommendedProducts={recommendedProducts}
              selectedProductId={selectedProductId}
              onSelectProduct={handleSelectProduct}
            />
          ) : (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="목표 금액과 월 납입액을 입력해주세요." />} />
          )}
        </>
      )}
    </>
  );
}
