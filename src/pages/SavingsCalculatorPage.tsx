import { SAVINGS_PRODUCT_TABS } from 'features/savings/constants';
import { useTab } from 'shared/hooks/useTab';
import { Border, ListHeader, ListRow, NavigationBar, Spacing } from 'tosslib';
import { useState } from 'react';
import { SavingsProductTab } from 'features/savings/components/Tab';
import { AmountInputSection } from 'features/savings/components/AmountInputSection';
import { TermsSelectBottomSheet } from 'features/savings/components/TermsSelectBottomSheet';
import { CalculationResultList } from 'features/savings/components/CalculationResultList';
import { savingsProductQuery } from 'features/savings/apis/queries';
import { useQuery } from '@tanstack/react-query';
import { SavingProductItem } from 'features/savings/components/SavingProductItem';
import { GreenCheckCircleIcon } from 'shared/icons/GreenCheckCircleIcon';

export function SavingsCalculatorPage() {
  const { tab, handleTabChange } = useTab(SAVINGS_PRODUCT_TABS.PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [terms, setTerms] = useState<string>('');

  const { data: savingsProducts } = useQuery(savingsProductQuery.listQuery());

  const filteredSavingsProducts = savingsProducts?.filter(
    product => monthlyPayment >= product.minMonthlyAmount && monthlyPayment <= product.maxMonthlyAmount
  );

  const baseProducts = filteredSavingsProducts?.length ? filteredSavingsProducts : savingsProducts;
  const recommendedProducts = [...(baseProducts ?? [])].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  const selectedSavingsProduct = savingsProducts?.find(product => product.id === selectedProductId);

  const hasFilteredProducts = filteredSavingsProducts && filteredSavingsProducts.length > 0;

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
        <>
          {hasFilteredProducts ? (
            filteredSavingsProducts.map(product => {
              const selected = selectedProductId === product.id;
              return (
                <ListRow
                  key={product.id}
                  contents={
                    <SavingProductItem
                      name={product.name}
                      annualRate={product.annualRate}
                      minMonthlyAmount={product.minMonthlyAmount}
                      maxMonthlyAmount={product.maxMonthlyAmount}
                      availableTerms={product.availableTerms}
                    />
                  }
                  right={selected ? <GreenCheckCircleIcon /> : undefined}
                  onClick={() => setSelectedProductId(product.id)}
                />
              );
            })
          ) : (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품이 존재하지 않습니다." />} />
          )}
        </>
      )}

      <Spacing size={8} />

      {tab === SAVINGS_PRODUCT_TABS.RESULTS && (
        <>
          <CalculationResultList
            product={selectedSavingsProduct}
            targetAmount={targetAmount}
            monthlyPayment={monthlyPayment}
            terms={parseInt(terms) || 0}
          />
          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />
          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />
          {recommendedProducts.map(product => {
            const selected = selectedProductId === product.id;
            return (
              <ListRow
                key={product.id}
                contents={
                  <SavingProductItem
                    name={product.name}
                    annualRate={product.annualRate}
                    minMonthlyAmount={product.minMonthlyAmount}
                    maxMonthlyAmount={product.maxMonthlyAmount}
                    availableTerms={product.availableTerms}
                  />
                }
                right={selected ? <GreenCheckCircleIcon /> : undefined}
                onClick={() => setSelectedProductId(product.id)}
              />
            );
          })}
          <Spacing size={40} />
        </>
      )}
    </>
  );
}
