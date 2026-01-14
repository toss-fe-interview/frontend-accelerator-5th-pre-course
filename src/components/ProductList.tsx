import { SavingsFilterForm } from 'hooks/useSavingsFilterForm';
import { savingsApis } from 'apis';
import { useFetch } from 'hooks/useFetch';
import { ProductListItem } from './ProductListItem';
import { SavingsProduct } from 'apis/type';

type ProductListProps = {
  selectedProductId?: string;
  onClick?: (id: string) => void;
  filterOptions: SavingsFilterForm;
};

export const ProductList = ({ selectedProductId, onClick, filterOptions }: ProductListProps) => {
  const { data: savingsProducts = [] } = useFetch(savingsApis.getSavingsProducts);
  const { monthlySaving, savingPeriod } = filterOptions;

  const filterProduct = (savingsProduct: SavingsProduct) => {
    const { minMonthlyAmount, maxMonthlyAmount, availableTerms } = savingsProduct;
    // 월 납입액 조건
    const monthlyMatchs =
      monthlySaving === '' || (Number(monthlySaving) >= minMonthlyAmount && Number(monthlySaving) <= maxMonthlyAmount);
    // 저축 기간 조건
    const termMathcs = availableTerms === savingPeriod;

    return monthlyMatchs && termMathcs;
  };

  return savingsProducts
    .filter(filterProduct)
    .map(sp => (
      <ProductListItem key={sp.id} savingsProduct={sp} onClick={onClick} selected={selectedProductId === sp.id} />
    ));
};
