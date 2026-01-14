import { useSavingsProducts } from 'apis/savings';
import { CalculationResult } from 'components/CalculationResult';
import { ProductList } from 'components/ProductList';
import { SavingsForm } from 'components/SavingsForm';
import { useMemo, useState } from 'react';
import { Border, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { SavingsFormData } from 'types/savings';
import { calculateSavingsResult } from 'utils/calculateSavings';
import { filterProducts } from 'utils/filterProducts';

type TabType = 'products' | 'results';

export function SavingsCalculatorPage() {
  const { data: products, status } = useSavingsProducts();
  const [formData, setFormData] = useState<SavingsFormData>({
    targetAmount: '',
    monthlyAmount: '',
    savingPeriod: 12,
  });
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabType>('products');

  // 필터링된 상품 목록
  const filteredProducts = useMemo(() => {
    if (!products) {
      return [];
    }

    if (formData.monthlyAmount === '') {
      return products;
    }

    return filterProducts(products, {
      monthlyAmount: Number(formData.monthlyAmount.replace(/,/g, '')),
      savingPeriod: formData.savingPeriod,
    });
  }, [products, formData.monthlyAmount, formData.savingPeriod]);

  const recommendedProducts = useMemo(() => {
    // 이미 필터링된 상품에서 연 이자율 상위 2개만 추출
    return filteredProducts.sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);
  }, [filteredProducts]);

  // 선택된 상품 정보
  const selectedProduct = useMemo(() => {
    if (!products || !selectedProductId) {
      return null;
    }
    return products.find(p => p.id === selectedProductId) ?? null;
  }, [products, selectedProductId]);

  // 계산 결과
  const calculationResult = useMemo(() => {
    if (!selectedProduct) {
      return null;
    }

    const targetAmount = Number(formData.targetAmount.replace(/,/g, ''));
    const monthlyAmount = Number(formData.monthlyAmount.replace(/,/g, ''));

    if (!targetAmount || !monthlyAmount) {
      return null;
    }

    return calculateSavingsResult({
      monthlyAmount,
      savingPeriod: formData.savingPeriod,
      annualRate: selectedProduct.annualRate,
      targetAmount,
    });
  }, [selectedProduct, formData]);

  const handleChangeInput = <K extends keyof SavingsFormData>(field: K, value: SavingsFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

      {/* 계산 결과 탭 */}
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
