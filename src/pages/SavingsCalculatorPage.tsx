import { SAVINGS_PRODUCT_TABS } from 'features/savings/constants';
import { useTab } from 'shared/hooks/useTab';
import { Border, ListHeader, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { useState } from 'react';
import { calculateExpectedAmount, calculateRecommendedMonthlyPayment } from 'features/savings/utils/calculate';
import { SavingsResultItem } from 'features/savings/components/SavingsResultItem';
import { savingsProductQuery } from 'features/savings/apis/queries';
import { useQuery } from '@tanstack/react-query';
import { SavingProductItem } from 'features/savings/components/SavingProductItem';
import { GreenCheckCircleIcon } from 'shared/icons/GreenCheckCircleIcon';
import { Select } from 'shared/components/Select';
import { NumberInput } from 'shared/components/NumberInput';
import { EmptyMessage } from 'shared/components/EmptyMessage';

export function SavingsCalculatorPage() {
  const { tab, handleTabChange } = useTab(SAVINGS_PRODUCT_TABS.PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [targetAmount, setTargetAmount] = useState<number | null>(null);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [terms, setTerms] = useState<number | null>(null);

  const { data: savingsProducts } = useQuery(savingsProductQuery.listQuery());

  const filteredSavingsProducts =
    monthlyPayment === null
      ? savingsProducts
      : savingsProducts?.filter(
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

      <NumberInput
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount}
        onChange={setTargetAmount}
      />
      <Spacing size={16} />
      <NumberInput
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyPayment}
        onChange={setMonthlyPayment}
      />
      <Spacing size={16} />

      <Select
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={terms?.toString() ?? ''}
        options={[
          { value: '6', label: '6개월' },
          { value: '12', label: '12개월' },
          { value: '24', label: '24개월' },
        ]}
        onChange={value => setTerms(parseInt(value))}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={handleTabChange}>
        <Tab.Item value={SAVINGS_PRODUCT_TABS.PRODUCTS} selected={tab === SAVINGS_PRODUCT_TABS.PRODUCTS}>
          적금 상품
        </Tab.Item>
        <Tab.Item value={SAVINGS_PRODUCT_TABS.RESULTS} selected={tab === SAVINGS_PRODUCT_TABS.RESULTS}>
          계산 결과
        </Tab.Item>
      </Tab>

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
            <EmptyMessage message="상품이 존재하지 않습니다." />
          )}
        </>
      )}

      <Spacing size={8} />

      {tab === SAVINGS_PRODUCT_TABS.RESULTS && (
        <>
          {selectedSavingsProduct ? (
            <>
              <SavingsResultItem
                label="예상 수익 금액"
                amount={calculateExpectedAmount({
                  annualRate: selectedSavingsProduct.annualRate,
                  monthlyPayment: monthlyPayment ?? 0,
                  terms: terms ?? 0,
                })}
              />
              <SavingsResultItem
                label="목표 금액과의 차이"
                amount={
                  (targetAmount ?? 0) -
                  calculateExpectedAmount({
                    annualRate: selectedSavingsProduct.annualRate,
                    monthlyPayment: monthlyPayment ?? 0,
                    terms: terms ?? 0,
                  })
                }
              />
              <SavingsResultItem
                label="추천 월 납입 금액"
                amount={calculateRecommendedMonthlyPayment({
                  targetAmount: targetAmount ?? 0,
                  annualRate: selectedSavingsProduct.annualRate,
                  terms: terms ?? 0,
                })}
              />
            </>
          ) : (
            <EmptyMessage message="상품을 선택해주세요." />
          )}
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
