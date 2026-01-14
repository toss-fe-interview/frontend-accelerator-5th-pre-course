import { useQuery } from '@tanstack/react-query';
import SavingsQuery from 'shared/query/saving';
import { SavingsProductType } from 'shared/types/api/savings';
import SavingsList from '../components/SavingsList';

interface SavingsProductListProps {
  term: number;
  monthlyPayment: number;
  selectedId?: string;
  onSelect?: (product: SavingsProductType) => void;
}

export default function SavingsProductList({ term, monthlyPayment, selectedId, onSelect }: SavingsProductListProps) {
  const { data: savingsProducts = [] } = useQuery(SavingsQuery.getSavingsProducts());

  const filteredProducts = savingsProducts.filter(product => {
    return (
      product.minMonthlyAmount < monthlyPayment &&
      product.maxMonthlyAmount > monthlyPayment &&
      product.availableTerms === term
    );
  });

  return (
    <SavingsList
      products={filteredProducts}
      renderEmpty={<SavingsList.Empty />}
      renderItem={product => {
        const { id, name, annualRate, minMonthlyAmount, maxMonthlyAmount, availableTerms } = product;

        return (
          <SavingsList.Item
            key={id}
            name={name}
            annualRate={annualRate}
            minMonthlyAmount={minMonthlyAmount}
            maxMonthlyAmount={maxMonthlyAmount}
            availableTerms={availableTerms}
            selected={selectedId === id}
            onSelect={() => onSelect?.(product)}
          />
        );
      }}
    />
  );
}
