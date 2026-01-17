import { useSavingsProductsQuery } from 'entities/savings/api';
import { formatNumberWithCommas, parseDigitsOnly } from 'entities/savings/lib';
import { SavingsTab } from 'entities/savings/model';
import {
  CalculationResult,
  Message,
  MonthlyDepositInput,
  SavingsProduct,
  TargetAmountInput,
} from 'entities/savings/ui';
import SavingsTermSelect from 'entities/savings/ui/SavingsTermSelect';
import { useState } from 'react';
import { isBetween, sortBy, takeFromHead } from 'shared/lib';
import { Assets, Border, ListHeader, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';

const SAVINGS_TERMS = [6, 12, 24];

const CheckCircleGreen = () => <Assets.Icon name="icon-check-circle-green" />;

export function SavingsCalculatorPage() {
  const [tab, setTab] = useState<SavingsTab>('products');
  const [targetAmount, setTargetAmount] = useState('');
  const savingsProductsQuery = useSavingsProductsQuery();
  const [monthlyDeposit, setMonthlyDeposit] = useState('');
  const [savingsTerm, setSavingTerm] = useState(12);
  const [selectedSavingsProductId, setSelectedSavingsProductId] = useState('');

  const availableSavingsProducts = (savingsProductsQuery.data ?? [])
    .filter(product => {
      const isMatchedSavingsTerm = product.availableTerms === savingsTerm;
      return isMatchedSavingsTerm;
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
    const sortedByDesc = sortBy(
      selectedSavingsProductId ? availableSavingsProducts : (savingsProductsQuery.data ?? []),
      product => product.annualRate,
      'desc'
    );
    return takeFromHead(sortedByDesc, 2);
  })();

  const selectedSavingsProduct = availableSavingsProducts.find(product => {
    const isMatchedSelectedSavingsProductId = product.id === selectedSavingsProductId;
    return isMatchedSelectedSavingsProductId;
  });

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />
      <TargetAmountInput
        value={formatNumberWithCommas(targetAmount)}
        onChange={e => {
          setTargetAmount(parseDigitsOnly(e.target.value));
        }}
      />
      <Spacing size={16} />
      <MonthlyDepositInput
        value={formatNumberWithCommas(monthlyDeposit)}
        onChange={e => {
          setMonthlyDeposit(parseDigitsOnly(e.target.value));
        }}
      />
      <Spacing size={16} />
      <SavingsTermSelect
        options={SAVINGS_TERMS}
        value={savingsTerm}
        onChange={term => {
          setSavingTerm(term);
        }}
      />
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
            <ListRow
              key={product.id}
              contents={<SavingsProduct key={product.id} product={product} />}
              right={isSelected && <CheckCircleGreen />}
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
              <ListRow
                contents={
                  <CalculationResult
                    label="예상 수익 금액"
                    value={`${(
                      Number(monthlyDeposit) *
                      selectedSavingsProduct.availableTerms *
                      (1 + selectedSavingsProduct.annualRate * 0.5)
                    ).toLocaleString()}원`}
                  />
                }
              />
              <ListRow
                contents={
                  <CalculationResult
                    label="목표 금액과의 차이"
                    value={`${(
                      Number(targetAmount) -
                      Number(monthlyDeposit) *
                        selectedSavingsProduct.availableTerms *
                        (1 + selectedSavingsProduct.annualRate * 0.5)
                    ).toLocaleString()}원`}
                  />
                }
              />
              <ListRow
                contents={
                  <CalculationResult
                    label="추천 월 납입 금액"
                    value={`${(
                      Math.round(
                        Number(targetAmount) /
                          (selectedSavingsProduct.availableTerms * (1 + selectedSavingsProduct.annualRate * 0.5)) /
                          1000
                      ) * 1000
                    ).toLocaleString()}원`}
                  />
                }
              />
            </>
          ) : (
            <ListRow contents={<Message value="상품을 선택해주세요." />} />
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
                return (
                  <ListRow
                    key={product.id}
                    contents={<SavingsProduct key={product.id} product={product} />}
                    right={isSelected && <CheckCircleGreen />}
                  />
                );
              })}
              <Spacing size={40} />
            </>
          )}
        </>
      )}
    </>
  );
}
