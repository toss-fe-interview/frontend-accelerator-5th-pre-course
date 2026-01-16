import { SAVINGS_PRODUCT_TABS } from 'features/savings/constants';
import { useTab } from 'shared/hooks/useTab';
import { Border, ListHeader, ListRow, NavigationBar, Spacing, TextField } from 'tosslib';
import { useState } from 'react';
import { SavingsProductTab } from 'features/savings/components/Tab';
import { CalculationResultList } from 'features/savings/components/CalculationResultList';
import { savingsProductQuery } from 'features/savings/apis/queries';
import { useQuery } from '@tanstack/react-query';
import { SavingProductItem } from 'features/savings/components/SavingProductItem';
import { GreenCheckCircleIcon } from 'shared/icons/GreenCheckCircleIcon';
import { Select } from 'shared/components/Select';

export function SavingsCalculatorPage() {
  const { tab, handleTabChange } = useTab(SAVINGS_PRODUCT_TABS.PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [targetAmount, setTargetAmount] = useState<string>('');
  const [monthlyPayment, setMonthlyPayment] = useState<string>('');
  const [terms, setTerms] = useState<string>('');

  const { data: savingsProducts } = useQuery(savingsProductQuery.listQuery());

  const monthlyPaymentNumber = parseInt(monthlyPayment) || 0;

  const filteredSavingsProducts =
    monthlyPaymentNumber === 0
      ? savingsProducts
      : savingsProducts?.filter(
          product =>
            monthlyPaymentNumber >= product.minMonthlyAmount && monthlyPaymentNumber <= product.maxMonthlyAmount
        );

  const baseProducts = filteredSavingsProducts?.length ? filteredSavingsProducts : savingsProducts;
  const recommendedProducts = [...(baseProducts ?? [])].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  const selectedSavingsProduct = savingsProducts?.find(product => product.id === selectedProductId);

  const hasFilteredProducts = filteredSavingsProducts && filteredSavingsProducts.length > 0;

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount}
        onChange={e => setTargetAmount(e.target.value.replace(/[^0-9]/g, ''))}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyPayment}
        onChange={e => setMonthlyPayment(e.target.value.replace(/[^0-9]/g, ''))}
      />
      <Spacing size={16} />

      <Select
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={terms}
        options={[
          { value: '6', text: '6개월' },
          { value: '12', text: '12개월' },
          { value: '24', text: '24개월' },
        ]}
        onChange={setTerms}
      />

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
            targetAmount={parseInt(targetAmount) || 0}
            monthlyPayment={monthlyPaymentNumber}
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
