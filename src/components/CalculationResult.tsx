import { Spacing } from 'tosslib';
import { SavingsProduct } from 'api/product';
import { SavingsSummary } from './SavingsSummary';
import { RecommendedProductList } from './RecommendedProductList';

interface CalculationResultProps {
  selectedSavingsProduct: SavingsProduct | null;
  targetAmount: number;
  monthlyPayment: number;
  savingPeriod: number;
  onSelectProduct: (product: SavingsProduct) => void;
}

export function CalculationResult({
  selectedSavingsProduct,
  targetAmount,
  monthlyPayment,
  savingPeriod,
  onSelectProduct,
}: CalculationResultProps) {
  return (
    <>
      <Spacing size={8} />

      <SavingsSummary
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
