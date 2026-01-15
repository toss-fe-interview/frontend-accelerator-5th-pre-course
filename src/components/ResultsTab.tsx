import { Spacing } from 'tosslib';
import { SavingsProduct } from 'api/product';
import { CalculationResult } from './CalculationResult';
import { RecommendedProductList } from './RecommendedProductList';

interface ResultsTabProps {
  selectedSavingsProduct: SavingsProduct | null;
  targetAmount: number;
  monthlyPayment: number;
  savingPeriod: number;
  onSelectProduct: (product: SavingsProduct) => void;
}

export function ResultsTab({
  selectedSavingsProduct,
  targetAmount,
  monthlyPayment,
  savingPeriod,
  onSelectProduct,
}: ResultsTabProps) {
  return (
    <>
      <Spacing size={8} />

      <CalculationResult
        selectedSavingsProduct={selectedSavingsProduct}
        targetAmount={targetAmount}
        monthlyPayment={monthlyPayment}
        savingPeriod={savingPeriod}
      />

      <RecommendedProductList
        monthlyPayment={monthlyPayment}
        savingPeriod={savingPeriod}
        selectedSavingsProduct={selectedSavingsProduct}
        onSelectProduct={onSelectProduct}
      />
    </>
  );
}
