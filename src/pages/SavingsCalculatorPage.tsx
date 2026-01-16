import { useSavingsProductsQuery } from 'entities/savings/api';
import { SAVINGS_DURATIONS } from 'entities/savings/config/constant';
import {
  extractNumbers,
  formatNumberWithCommas,
  getAvailableSavingsProducts,
  getRecommendedSavingsProducts,
  getSelectedSavingsProduct,
} from 'entities/savings/lib';
import { SavingsTab } from 'entities/savings/model';
import { CalculationResults, Placeholder, SavingsProductItem } from 'entities/savings/ui';
import List from 'entities/savings/ui/List';
import { useState } from 'react';
import { Border, ListHeader, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';

export function SavingsCalculatorPage() {
  const [tab, setTab] = useState<SavingsTab>('products');
  const [targetAmount, setTargetAmount] = useState('');
  const savingsProductsQuery = useSavingsProductsQuery();
  const [monthlyDeposit, setMonthlyDeposit] = useState('');
  const [savingDuration, setSavingDuration] = useState(12);
  const [selectedSavingsProductId, setSelectedSavingsProductId] = useState('');

  const availableSavingsProducts = getAvailableSavingsProducts({
    products: savingsProductsQuery.data,
    monthlyDeposit,
    savingDuration,
  });
  const recommendedSavingsProducts = getRecommendedSavingsProducts(availableSavingsProducts);
  const selectedSavingsProduct = getSelectedSavingsProduct(availableSavingsProducts, selectedSavingsProductId);

  const hasRecommendedSavingsProducts = recommendedSavingsProducts.length > 0;

  const onTargetPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetAmount(extractNumbers(e.target.value));
  };

  const onMonthlyDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonthlyDeposit(extractNumbers(e.target.value));
  };

  const onSavingDurationChange = (duration: number) => {
    setSavingDuration(duration);
  };

  const onSavingsTabChange = (value: string) => {
    setTab(value as SavingsTab);
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={formatNumberWithCommas(targetAmount)}
        onChange={onTargetPriceChange}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        onChange={onMonthlyDepositChange}
        value={formatNumberWithCommas(monthlyDeposit)}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingDuration}
        onChange={onSavingDurationChange}
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
      <Tab onChange={onSavingsTabChange}>
        <Tab.Item value="products" selected={tab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={tab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>
      {tab === 'products' && (
        <List list={availableSavingsProducts}>
          {product => (
            <SavingsProductItem
              key={product.id}
              product={product}
              checked={product.id === selectedSavingsProductId}
              onClick={() => {
                setSelectedSavingsProductId(product.id);
              }}
            />
          )}
        </List>
      )}
      {tab === 'results' && (
        <>
          <Spacing size={8} />
          {selectedSavingsProduct ? (
            <CalculationResults
              results={[
                {
                  label: '예상 수익 금액',
                  value: `${formatNumberWithCommas(
                    Number(monthlyDeposit) *
                      selectedSavingsProduct.availableTerms *
                      (1 + selectedSavingsProduct.annualRate * 0.5)
                  )}원`,
                },
                {
                  label: '목표 금액과의 차이',
                  value: `${formatNumberWithCommas(
                    Number(targetAmount) -
                      Number(monthlyDeposit) *
                        selectedSavingsProduct.availableTerms *
                        (1 + selectedSavingsProduct.annualRate * 0.5)
                  )}원`,
                },
                {
                  label: '추천 월 납입 금액',
                  value: `${formatNumberWithCommas(
                    Math.round(
                      Number(targetAmount) /
                        (selectedSavingsProduct.availableTerms * (1 + selectedSavingsProduct.annualRate * 0.5)) /
                        1000
                    ) * 1000
                  )}원`,
                },
              ]}
            />
          ) : (
            <Placeholder message="상품을 선택해주세요." />
          )}
          {hasRecommendedSavingsProducts && (
            <>
              <Spacing size={8} />
              <Border height={16} />
              <Spacing size={8} />
              <ListHeader
                title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
              />
              <Spacing size={12} />
              <List list={recommendedSavingsProducts}>
                {product => (
                  <SavingsProductItem
                    key={product.id}
                    product={product}
                    checked={product.id === selectedSavingsProductId}
                  />
                )}
              </List>
              <Spacing size={40} />
            </>
          )}
        </>
      )}
    </>
  );
}
