import ErrorBoundary from 'common/components/ErrorBoundary';
import ResultSection from 'product/components/ResultSection';
import TermSelectBottomSheet from 'product/components/TermSelectBottomSheet';
import { Suspense, useState } from 'react';
import { Border, NavigationBar, Spacing, TextField } from 'tosslib';

const validateIsNumberWithComma = (value: string) => {
  return /^(\d+,?)*\d*$/.test(value);
};

const formatWithThousandComma = (value: string) => {
  if (value === '') {
    return '';
  }

  return Number(value.replace(/,/g, '')).toLocaleString();
};

export function SavingsCalculatorPage() {
  const [price, setPrice] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [term, setTerm] = useState<number | null>(null);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={price}
        onChange={e => {
          const value = e.target.value;

          if (!validateIsNumberWithComma(value)) {
            return;
          }

          const formattedValue = formatWithThousandComma(value);

          setPrice(formattedValue);
        }}
      />

      <Spacing size={16} />

      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyPayment}
        onChange={e => {
          const value = e.target.value;

          if (!validateIsNumberWithComma(value)) {
            return;
          }

          const formattedValue = formatWithThousandComma(value);

          setMonthlyPayment(formattedValue);
        }}
      />

      <Spacing size={16} />

      <TermSelectBottomSheet
        value={term}
        onChange={value => {
          setTerm(value);
        }}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <ErrorBoundary>
        <Suspense>
          <ResultSection price={price} monthlyPayment={monthlyPayment} term={term} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
