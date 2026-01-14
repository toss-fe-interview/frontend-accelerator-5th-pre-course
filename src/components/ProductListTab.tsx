import { filterSavingsProducts } from 'domain/savingsFilter';
import { useSavingsProducts } from 'hook/useSavingsProducts';
import { useMemo } from 'react';
import { useUserSavingGoalStore } from 'store/useUserSavingGoalStore';
import { colors, ListRow } from 'tosslib';

const ProductListTab = () => {
  const { data, isLoading, isError } = useSavingsProducts();
  const { userSavingGoal } = useUserSavingGoalStore();

  const filteredProducts = useMemo(() => {
    if (!data) return [];
    if (!userSavingGoal.monthlyAmount || !userSavingGoal.term) return data;
    return filterSavingsProducts(data, userSavingGoal.monthlyAmount, userSavingGoal.term);
  }, [data, userSavingGoal.monthlyAmount, userSavingGoal.term]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  if (!data) return <div>No data</div>;

  return (
    <>
      {filteredProducts.map(product => (
        <ListRow
          key={product.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${product.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${product.minMonthlyAmount.toLocaleString()}원 ~ ${product.maxMonthlyAmount.toLocaleString()}원 | ${product.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          onClick={() => {}}
        />
      ))}
    </>
  );
};

export default ProductListTab;
