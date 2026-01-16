import { useSavingsProductsQuery } from 'entities/savings/api';
import { SAVINGS_DURATIONS } from 'entities/savings/config/constant';
import { formatNumberWithCommas, parseDigitsOnly } from 'entities/savings/lib';
import { SavingsTab } from 'entities/savings/model';
import { CalculationResultItem, Placeholder, SavingsProductItem } from 'entities/savings/ui';
import { useState } from 'react';
import { isBetween, sortBy, takeFromHead } from 'shared/lib';
import { Border, ListHeader, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';

export function SavingsCalculatorPage() {
  const [tab, setTab] = useState<SavingsTab>('products');
  const [targetAmount, setTargetAmount] = useState('');
  const savingsProductsQuery = useSavingsProductsQuery();
  const [monthlyDeposit, setMonthlyDeposit] = useState('');
  const [savingDuration, setSavingDuration] = useState(12);
  const [selectedSavingsProductId, setSelectedSavingsProductId] = useState('');

  const availableSavingsProducts = (savingsProductsQuery.data ?? [])
    .filter(product => {
      const isMatchedSavingDuration = product.availableTerms === savingDuration;
      return isMatchedSavingDuration;
    })
    .filter(product => {
      const isBetweenMonthlyDeposit = isBetween({
        value: Number(monthlyDeposit),
        min: product.minMonthlyAmount,
        max: product.maxMonthlyAmount,
        inclusive: true,
      });
      return isBetweenMonthlyDeposit;
    });

  const recommendedSavingsProducts = (() => {
    const sorted = sortBy(availableSavingsProducts, product => product.annualRate, 'desc');
    return takeFromHead(sorted, 2);
  })();

  const selectedSavingsProduct = availableSavingsProducts.find(product => {
    const isMatchedSelectedSavingsProductId = product.id === selectedSavingsProductId;
    return isMatchedSelectedSavingsProductId;
  });

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={formatNumberWithCommas(targetAmount)}
        onChange={e => {
          setTargetAmount(parseDigitsOnly(e.target.value));
        }}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={formatNumberWithCommas(monthlyDeposit)}
        onChange={e => {
          setMonthlyDeposit(parseDigitsOnly(e.target.value));
        }}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingDuration}
        onChange={duration => {
          setSavingDuration(duration);
        }}
      >
        {SAVINGS_DURATIONS.map(duration => (
          <SelectBottomSheet.Option key={duration} value={duration}>
            {`${duration}개월`}
          </SelectBottomSheet.Option>
        ))}
      </SelectBottomSheet>
      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />
      <Tab
        onChange={value => {
          setTab(value as SavingsTab);
        }}
      >
        <Tab.Item value="products" selected={tab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={tab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>
      {tab === 'products' &&
        availableSavingsProducts.map(product => {
          const isSelected = product.id === selectedSavingsProductId;
          return (
            <SavingsProductItem
              key={product.id}
              product={product}
              checked={isSelected}
              onClick={() => {
                setSelectedSavingsProductId(product.id);
              }}
            />
          );
        })}
      {tab === 'results' && (
        <>
          <Spacing size={8} />
          {selectedSavingsProduct ? (
            <>
              <CalculationResultItem
                label="예상 수익 금액"
                value={`${(
                  Number(monthlyDeposit) *
                  selectedSavingsProduct.availableTerms *
                  (1 + selectedSavingsProduct.annualRate * 0.5)
                ).toLocaleString()}원`}
              />
              <CalculationResultItem
                label="목표 금액과의 차이"
                value={`${(
                  Number(targetAmount) -
                  Number(monthlyDeposit) *
                    selectedSavingsProduct.availableTerms *
                    (1 + selectedSavingsProduct.annualRate * 0.5)
                ).toLocaleString()}원`}
              />
              <CalculationResultItem
                label="추천 월 납입 금액"
                value={`${(
                  Math.round(
                    Number(targetAmount) /
                      (selectedSavingsProduct.availableTerms * (1 + selectedSavingsProduct.annualRate * 0.5)) /
                      1000
                  ) * 1000
                ).toLocaleString()}원`}
              />
            </>
          ) : (
            <Placeholder message="상품을 선택해주세요." />
          )}
          {recommendedSavingsProducts.length > 0 && (
            <>
              <Spacing size={8} />
              <Border height={16} />
              <Spacing size={8} />
              <ListHeader
                title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
              />
              <Spacing size={12} />
              {recommendedSavingsProducts.map(product => {
                const isSelected = product.id === selectedSavingsProductId;
                return <SavingsProductItem key={product.id} product={product} checked={isSelected} />;
              })}
              <Spacing size={40} />
            </>
          )}
        </>
      )}
    </>
  );
}
