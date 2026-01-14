import ErrorBoundary from 'common/components/ErrorBoundary';
import InputSection from 'product/components/InputSection';
import ResultSection from 'product/components/ResultSection';
import { Suspense, useState } from 'react';
import { Border, NavigationBar, Spacing } from 'tosslib';

const validateInputNumber = (value: string) => {
  return /^[\d,]*$/.test(value);
};

const formatValue = (value: string) => {
  return value.replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export function SavingsCalculatorPage() {
  const [price, setPrice] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [term, setTerm] = useState<number | null>(null);

  const handlePriceChange = (value: string) => {
    if (!validateInputNumber(value)) {
      return;
    }

    const formattedValue = formatValue(value);

    setPrice(formattedValue);
  };

  const handleMonthlyPaymentChange = (value: string) => {
    if (!validateInputNumber(value)) {
      return;
    }

    const formattedValue = formatValue(value);

    setMonthlyPayment(formattedValue);
  };

  const handleTermChange = (value: number) => {
    setTerm(value);
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <InputSection
        price={price}
        monthlyPayment={monthlyPayment}
        term={term}
        handlePriceChange={handlePriceChange}
        handleMonthlyPaymentChange={handleMonthlyPaymentChange}
        handleTermChange={handleTermChange}
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
