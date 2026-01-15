import { AsyncValue } from 'shared/model';
import { SavingsProduct } from '../model';

export const extractNumbers = (value: string) => {
  return value.replace(/[^0-9]/g, '');
};

export const formatNumberWithCommas = (value: string) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const getRecommendedSavingsProducts = (savingsProduct: AsyncValue<SavingsProduct[]>) => {
  if (!savingsProduct) {
    return [];
  }

  return savingsProduct.sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);
};

export const getSelectedSavingsProduct = (
  savingsProduct: AsyncValue<SavingsProduct[]>,
  selectedSavingsProductId: string
) => {
  if (!savingsProduct) {
    return undefined;
  }

  return savingsProduct.find(product => product.id === selectedSavingsProductId);
};

export const getAvailableSavingsProducts = ({
  products,
  monthlyDeposit,
  savingDuration,
}: {
  products: AsyncValue<SavingsProduct[]>;
  monthlyDeposit: string;
  savingDuration: number;
}) => {
  if (!products) {
    return [];
  }

  return products
    .filter(product => product.availableTerms === savingDuration)
    .filter(product => {
      const isValidAmount =
        product.minMonthlyAmount <= Number(monthlyDeposit) && Number(monthlyDeposit) <= product.maxMonthlyAmount;
      return isValidAmount;
    });
};
