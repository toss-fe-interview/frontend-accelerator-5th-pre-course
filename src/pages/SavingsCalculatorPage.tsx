import { SAVINGS_PRODUCT_TABS } from 'features/savings-products/constants';
import { useTab } from 'shared/hooks/useTab';
import { Border, ListHeader, ListRow, NavigationBar, Spacing } from 'tosslib';
import { SavingsProductItem } from 'features/savings-products/components/Item';
import { useState } from 'react';
import { SavingsProductTab } from 'features/savings-products/components/Tab';
import { SavingsCalculateItem } from 'features/savings-products-calculate/components/Item';
import { calculateExpectedAmount, calculateRecommendedMonthlyPayment } from 'features/savings-products-calculate/utils';
import { toNumber } from 'shared/utils/format';
import { useSavingsProducts } from 'features/savings-products/hooks/useSavingsProducts';
import { AmountInputSection } from 'features/savings-products/components/AmountInputSection';
import { SavingBottomSheet } from 'features/savings-products/components/SavingBottomSheet';

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

      <SavingBottomSheet terms={terms} onTermsChange={setTerms} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <SavingsProductTab tab={tab} handleTabChange={handleTabChange} />

      {tab === SAVINGS_PRODUCT_TABS.PRODUCTS && (
        <>
          {filteredSavingsProducts?.map(product => (
            <SavingsProductItem
              key={product.id}
              product={product}
              selected={selectedProductId === product.id}
              onSelect={() => setSelectedProductId(product.id)}
            />
          ))}
        </>
      )}
      <Spacing size={8} />
      {tab === SAVINGS_PRODUCT_TABS.RESULTS && (
        <>
          {selectedProductId ? (
            <>
              <SavingsCalculateItem
                label="예상 수익 금액"
                value={calculateExpectedAmount({
                  annualRate: selectedSavingsProduct?.annualRate || 0,
                  monthlyPayment: toNumber(monthlyPayment),
                  terms: toNumber(terms),
                })}
              />
              <SavingsCalculateItem
                label="목표 금액과의 차이"
                value={
                  toNumber(targetAmount) -
                  calculateExpectedAmount({
                    annualRate: selectedSavingsProduct?.annualRate || 0,
                    monthlyPayment: toNumber(monthlyPayment),
                    terms: toNumber(terms),
                  })
                }
              />
              <SavingsCalculateItem
                label="추천 월 납입 금액"
                value={calculateRecommendedMonthlyPayment({
                  targetAmount: toNumber(targetAmount),
                  annualRate: selectedSavingsProduct?.annualRate || 0,
                  terms: toNumber(terms),
                })}
              />
            </>
          ) : (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          )}
          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />
          {recommendedProducts(filteredSavingsProducts, savingsProducts).map(product => (
            <SavingsProductItem
              key={product.id}
              product={product}
              selected={selectedProductId === product.id}
              onSelect={() => setSelectedProductId(product.id)}
            />
          ))}
          <Spacing size={40} />
        </>
      )}
    </>
  );
}
