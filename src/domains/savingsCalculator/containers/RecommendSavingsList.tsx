import { ListHeader, Spacing } from 'tosslib';
import { useQuery } from '@tanstack/react-query';
import SavingsQuery from 'shared/query/saving';
import SavingsList from '../components/SavingsList';

interface RecommendSavingsListProps {
  userInputs: {
    monthlyPayment: number;
    term: number;
  };
}

export default function RecommendSavingsList({
  userInputs = { monthlyPayment: 0, term: 0 },
}: RecommendSavingsListProps) {
  const { monthlyPayment, term } = userInputs;

  const { data: savingsProducts = [] } = useQuery(SavingsQuery.getSavingsProducts());

  const filteredProducts = savingsProducts
    .filter(product => {
      return (
        product.minMonthlyAmount < monthlyPayment &&
        product.maxMonthlyAmount > monthlyPayment &&
        product.availableTerms === term
      );
    })
    .sort((a, b) => b.annualRate - a.annualRate)
    .slice(0, 2);

  return (
    <>
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      <SavingsList
        products={filteredProducts}
        renderEmpty={<SavingsList.Empty />}
        renderItem={product => {
          return (
            <SavingsList.Item
              key={product.id}
              name={product.name}
              annualRate={product.annualRate}
              minMonthlyAmount={product.minMonthlyAmount}
              maxMonthlyAmount={product.maxMonthlyAmount}
              availableTerms={product.availableTerms}
            />
          );
        }}
      />
    </>
  );
}
