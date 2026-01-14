import { useSuspenseQuery } from '@tanstack/react-query';
import SavingProducts from './SavingProducts';
import { savingsProductsQueryOptions } from 'product/queries';
import { getFilteredProducts } from 'product/utils/getFilteredProducts';
import { SavingProduct } from 'product/type/internal';

interface Props {
  monthlyPayment: string;
  term: number;
  selectedProduct: SavingProduct;
}

const RecommendedProducts = ({ monthlyPayment, term, selectedProduct }: Props) => {
  const { data: recommendedProducts } = useSuspenseQuery({
    ...savingsProductsQueryOptions,
    select: data =>
      getFilteredProducts(data, monthlyPayment, term)
        .sort((a, b) => a.annualRate - b.annualRate)
        .slice(0, 2),
  });

  return <SavingProducts type="recommended" data={recommendedProducts} selectedProduct={selectedProduct} />;
};

export default RecommendedProducts;
