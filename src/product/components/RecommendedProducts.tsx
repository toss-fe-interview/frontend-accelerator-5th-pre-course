import { useSuspenseQuery } from '@tanstack/react-query';
import { savingsProductsQueryOptions } from 'product/queries';
import type { SavingProduct as SavingProductType } from 'product/type/internal';
import SavingProduct from './SavingProduct';
import { productFilter } from 'product/utils/getFilteredProducts';

interface Props {
  monthlyPayment: string;
  term: number | null;
  selectedProduct: SavingProductType;
}

const RecommendedProducts = ({ monthlyPayment, term, selectedProduct }: Props) => {
  const { data: recommendedProducts } = useSuspenseQuery({
    ...savingsProductsQueryOptions,
    select: data =>
      data
        .filter(product => productFilter({ product, monthlyPayment, term }))
        .sort((a, b) => b.annualRate - a.annualRate)
        .slice(0, 2),
  });

  return recommendedProducts.map(product => (
    <SavingProduct key={product.id} product={product} selected={selectedProduct?.id === product.id} />
  ));
};

export default RecommendedProducts;
