import { useSavingsProductsQuery } from '../api';

type UseSavingsProductsProps = {
  savingDuration: number;
  monthlyDeposit: string;
  selectedSavingsProductId: string;
};

const useSavingsProducts = ({ savingDuration, monthlyDeposit, selectedSavingsProductId }: UseSavingsProductsProps) => {
  const savingsProductsQuery = useSavingsProductsQuery();

  const filteredSavingsProducts =
    savingsProductsQuery.data
      ?.filter(product => product.availableTerms === savingDuration)
      .filter(
        product =>
          product.minMonthlyAmount <= Number(monthlyDeposit) && Number(monthlyDeposit) <= product.maxMonthlyAmount
      ) ?? [];

  const recommendedSavingsProducts =
    filteredSavingsProducts?.sort((a, b) => b.annualRate - a.annualRate).slice(0, 2) ?? [];

  const selectedSavingsProduct = filteredSavingsProducts?.find(product => product.id === selectedSavingsProductId);

  return {
    filteredSavingsProducts,
    recommendedSavingsProducts,
    selectedSavingsProduct,
  };
};

export default useSavingsProducts;
