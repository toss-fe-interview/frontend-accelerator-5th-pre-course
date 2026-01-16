import { AsyncValue } from 'shared/model';
import { SavingsProduct } from '../model';
import { sortBy, takeFromHead, isBetween } from 'shared/lib';

export const parseDigitsOnly = (value: string) => {
  const NON_DIGIT_REGEX = /[^0-9]/g;

  return value.replace(NON_DIGIT_REGEX, '');
};

export const formatNumberWithCommas = (value: string) => {
  const THOUSANDS_SEPARATOR_REGEX = /\B(?=(\d{3})+(?!\d))/g;

  return value.replace(THOUSANDS_SEPARATOR_REGEX, ',');
};

export const getRecommendedSavingsProducts = (savingsProduct: AsyncValue<SavingsProduct[]>) => {
  if (!savingsProduct) {
    return [];
  }

  const sorted = sortBy(savingsProduct, product => product.annualRate, 'desc');
  return takeFromHead(sorted, 2);
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
    .filter(product =>
      isBetween({
        value: Number(monthlyDeposit),
        min: product.minMonthlyAmount,
        max: product.maxMonthlyAmount,
        inclusive: true,
      })
    );
};
