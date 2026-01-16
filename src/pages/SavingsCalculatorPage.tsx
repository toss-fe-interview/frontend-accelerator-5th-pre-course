import { Border, NavigationBar, Spacing } from 'tosslib';
import { useState } from 'react';
import { SavingsProductFilterForm } from 'features/savings/components/SavingsProductFilterForm';
import { SavingsProductTab } from 'features/savings/components/SavingsProductTab';

export function SavingsCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState<number | null>(null);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [terms, setTerms] = useState<number | null>(null);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsProductFilterForm
        targetAmount={targetAmount}
        onTargetAmountChange={setTargetAmount}
        monthlyPayment={monthlyPayment}
        onMonthlyPaymentChange={setMonthlyPayment}
        terms={terms}
        onTermsChange={setTerms}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <SavingsProductTab targetAmount={targetAmount} monthlyPayment={monthlyPayment} terms={terms} />
    </>
  );
}
