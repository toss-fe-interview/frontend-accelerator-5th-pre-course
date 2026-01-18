import ErrorBoundary from 'common/components/ErrorBoundary';
import MonthlyPaymentInput from 'product/components/MonthlyPaymentInput';
import PriceInput from 'product/components/PriceInput';
import ResultSection from 'product/components/ResultSection';
import TermSelectBottomSheet from 'product/components/TermSelectBottomSheet';
import { Suspense, useState } from 'react';
import { Border, NavigationBar, Spacing } from 'tosslib';

const validateIsNumberWithComma = (value: string) => {
  return /^[\d,]*$/.test(value);
};

const formatNumberWithComma = (value: string) => {
  return value.replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export function SavingsCalculatorPage() {
  const [price, setPrice] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [term, setTerm] = useState<number | null>(null);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <PriceInput
        value={price}
        onChange={value => {
          if (!validateIsNumberWithComma(value)) {
            return;
          }

          const formattedValue = formatNumberWithComma(value);

          setPrice(formattedValue);
        }}
      />
      <Spacing size={16} />
      <MonthlyPaymentInput
        value={monthlyPayment}
        onChange={value => {
          if (!validateIsNumberWithComma(value)) {
            return;
          }

          const formattedValue = formatNumberWithComma(value);

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
