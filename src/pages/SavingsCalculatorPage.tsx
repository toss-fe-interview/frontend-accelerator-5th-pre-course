import { useEffect, useMemo, useState } from 'react';
import { Border, ListHeader, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { useSavingsProducts } from '../hooks/useSavingsProducts';
import { ApiStateHandler } from '../components/ApiStateHandler';
import { SavingsProductListItem } from '../components/SavingsProductListItem';
import { CalculationResults } from '../components/CalculationResults';
import { SavingsInputForm } from '../components/SavingsInputForm';
import { filterProducts } from '../utils/productFilter';
import {
  calculateDifference,
  calculateExpectedAmount,
  calculateRecommendedMonthlyAmount,
  getTopProducts,
} from '../utils/calculation';

export function SavingsCalculatorPage() {
  const { products, isLoading, error } = useSavingsProducts();

  // 사용자 입력 상태 관리
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [monthlyAmount, setMonthlyAmount] = useState<number>(0);
  const [savingTerm, setSavingTerm] = useState<number>(12);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'products' | 'results'>('products');

  // 입력값에 따라 필터링된 상품 목록 계산
  const filteredProducts = useMemo(() => {
    return filterProducts(products, {
      monthlyAmount,
      savingTerm,
    });
  }, [products, monthlyAmount, savingTerm]);

  // 선택된 상품 정보
  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || null;
  }, [products, selectedProductId]);

  // 계산 결과
  const calculationResults = useMemo(() => {
    if (!selectedProduct || monthlyAmount === 0) {
      return null;
    }

    const expectedAmount = calculateExpectedAmount(monthlyAmount, savingTerm, selectedProduct.annualRate);
    const difference = calculateDifference(targetAmount, expectedAmount);
    const recommendedAmount = calculateRecommendedMonthlyAmount(targetAmount, savingTerm, selectedProduct.annualRate);

    return {
      expectedAmount,
      difference,
      recommendedAmount,
    };
  }, [selectedProduct, monthlyAmount, savingTerm, targetAmount]);

  // 추천 상품 목록 (연 이자율 상위 2개)
  const recommendedProducts = useMemo(() => {
    return getTopProducts(filteredProducts, 2);
  }, [filteredProducts]);

  // 필터링된 상품 목록이 변경되면 선택된 상품이 목록에 있는지 확인하고 없으면 선택 해제
  useEffect(() => {
    if (selectedProductId && !filteredProducts.find(p => p.id === selectedProductId)) {
      setSelectedProductId(null);
    }
  }, [filteredProducts, selectedProductId]);

  // 목표 금액 입력 핸들러
  const handleTargetAmountChange = (value: string) => {
    const numericValue = parseInt(value.replace(/,/g, ''), 10);
    setTargetAmount(isNaN(numericValue) ? 0 : numericValue);
  };

  // 월 납입액 입력 핸들러
  const handleMonthlyAmountChange = (value: string) => {
    const numericValue = parseInt(value.replace(/,/g, ''), 10);
    setMonthlyAmount(isNaN(numericValue) ? 0 : numericValue);
  };

  // 저축 기간 선택 핸들러
  const handleSavingTermChange = (value: number) => {
    setSavingTerm(value);
  };

  // 적금 상품 선택 핸들러
  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsInputForm
        targetAmount={targetAmount}
        monthlyAmount={monthlyAmount}
        savingTerm={savingTerm}
        onTargetAmountChange={handleTargetAmountChange}
        onMonthlyAmountChange={handleMonthlyAmountChange}
        onSavingTermChange={handleSavingTermChange}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSelectedTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === 'products' && (
        <ApiStateHandler isLoading={isLoading} error={error} loadingMessage="적금 상품을 불러오는 중...">
          {filteredProducts.length === 0 ? (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없습니다." />} />
          ) : (
            filteredProducts.map(product => (
              <SavingsProductListItem
                key={product.id}
                product={product}
                isSelected={selectedProductId === product.id}
                onSelect={handleProductSelect}
              />
            ))
          )}
        </ApiStateHandler>
      )}

      {selectedTab === 'results' && (
        <>
          {!selectedProduct ? (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          ) : (
            <>
              <Spacing size={8} />

              <CalculationResults
                expectedAmount={calculationResults?.expectedAmount || 0}
                difference={calculationResults?.difference || 0}
                recommendedAmount={calculationResults?.recommendedAmount || 0}
              />

              <Spacing size={8} />
              <Border height={16} />
              <Spacing size={8} />

              <ListHeader
                title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
              />
              <Spacing size={12} />

              {recommendedProducts.length === 0 ? (
                <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 상품이 없습니다." />} />
              ) : (
                recommendedProducts.map(product => (
                  <SavingsProductListItem
                    key={product.id}
                    product={product}
                    isSelected={selectedProductId === product.id}
                    onSelect={handleProductSelect}
                  />
                ))
              )}

              <Spacing size={40} />
            </>
          )}
        </>
      )}
    </>
  );
}
