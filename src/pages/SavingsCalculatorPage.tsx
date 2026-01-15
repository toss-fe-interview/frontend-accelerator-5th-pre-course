import { useState } from 'react';
import { NavigationBar, Spacing, Border } from 'tosslib';
import { CalculatorFields } from '../components/CalculatorFields';
import { ProductTabs } from '../components/ProductTabs';
import { SavingsProduct } from '../components/ProductTabs/types';
import { calculateExpectedProfit, calculateRecommendMonthlyPayment } from '../utils/math';

export function SavingsCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [savingTerms, setSavingTerms] = useState(12);
  const [selectedSavingProduct, setSelectedSavingProduct] = useState<SavingsProduct | null>(null);

  const expectedProfit = calculateExpectedProfit(monthlyAmount, savingTerms, selectedSavingProduct?.annualRate ?? 0);
  const diffAmount = Number(targetAmount ?? 0) - expectedProfit;
  const recommendMonthlyPayment = calculateRecommendMonthlyPayment(
    targetAmount,
    savingTerms,
    selectedSavingProduct?.annualRate ?? 0
  );

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <CalculatorFields
        targetAmount={targetAmount}
        monthlyAmount={monthlyAmount}
        savingTerms={savingTerms}
        onTargetAmountChange={setTargetAmount}
        onMonthlyAmountChange={setMonthlyAmount}
        onSavingTermsChange={setSavingTerms}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <ProductTabs
        targetAmount={targetAmount}
        monthlyAmount={monthlyAmount}
        savingTerms={savingTerms}
        selectedProduct={selectedSavingProduct}
        onProductSelect={setSelectedSavingProduct}
        expectedProfit={expectedProfit}
        diffAmount={diffAmount}
        recommendMonthlyPayment={recommendMonthlyPayment}
      />
    </>
  );
}
