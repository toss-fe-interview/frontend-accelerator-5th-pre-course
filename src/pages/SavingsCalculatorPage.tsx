import { SAVINGS_PRODUCT_TABS } from 'features/savings/constants';
import { useTab } from 'shared/hooks/useTab';
import { Border, NavigationBar, Spacing } from 'tosslib';
import { useState } from 'react';
import { SavingsProductTab } from 'features/savings/components/Tab';
import { toNumber } from 'shared/utils/format';
import { useSavingsProducts } from 'features/savings/hooks/useSavingsProducts';
import { AmountInputSection } from 'features/savings/components/AmountInputSection';
import { TermsSelectBottomSheet } from 'features/savings/components/TermsSelectBottomSheet';
import { SavingsProductList } from 'features/savings/components/SavingsProductList';
import { CalculationResultList } from 'features/savings/components/CalculationResultList';
import { RecommendedProductList } from 'features/savings/components/RecommendedProductList';

export function SavingsCalculatorPage() {
  const { tab, handleTabChange } = useTab(SAVINGS_PRODUCT_TABS.PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [monthlyPayment, setMonthlyPayment] = useState<string>('');
  const [terms, setTerms] = useState<string>('');

  const { filteredSavingsProducts, recommendedProducts, savingsProducts } = useSavingsProducts(monthlyPayment);

  const selectedSavingsProduct = savingsProducts?.find(product => product.id === selectedProductId);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <AmountInputSection
        targetAmount={targetAmount}
        monthlyPayment={monthlyPayment}
        setTargetAmount={setTargetAmount}
        setMonthlyPayment={setMonthlyPayment}
      />
      <Spacing size={16} />

      <TermsSelectBottomSheet terms={terms} onTermsChange={setTerms} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <SavingsProductTab tab={tab} handleTabChange={handleTabChange} />

      {tab === SAVINGS_PRODUCT_TABS.PRODUCTS && (
        <SavingsProductList
          products={filteredSavingsProducts}
          selectedProductId={selectedProductId}
          onSelect={setSelectedProductId}
        />
      )}

      <Spacing size={8} />

      {tab === SAVINGS_PRODUCT_TABS.RESULTS && (
        <>
          <CalculationResultList
            product={selectedSavingsProduct}
            targetAmount={toNumber(targetAmount)}
            monthlyPayment={toNumber(monthlyPayment)}
            terms={toNumber(terms)}
          />
          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />
          <RecommendedProductList
            products={recommendedProducts}
            selectedProductId={selectedProductId}
            onSelect={setSelectedProductId}
          />
          <Spacing size={40} />
        </>
      )}
    </>
  );
}
