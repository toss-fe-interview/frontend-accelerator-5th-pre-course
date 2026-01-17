import { SavingProduct } from 'models/SavingProduct';
import { SavingCalculationParams } from '../types/SavingCalculationParam';

interface IsSuitableForConditionsProps {
  product: SavingProduct;
  calculationParams: SavingCalculationParams;
}

export const isSuitableForConditions = ({ product, calculationParams }: IsSuitableForConditionsProps): boolean => {
  const { monthlyPayment, term } = calculationParams;
  return (
    product.minMonthlyAmount <= monthlyPayment &&
    product.maxMonthlyAmount >= monthlyPayment &&
    product.availableTerms === term
  );
};
