import { useSavingsProductListQuery } from 'services/useSavingsProductListQuery';
import { Assets, colors, ListRow } from 'tosslib';
import { SavingsProduct } from 'types';
import { Term } from 'useSavingsProductFilters';

type Props = {
  filters: {
    targetAmount: number;
    monthlyPayment: number;
    term: Term;
  };
  selectedSavingsProduct: SavingsProduct | null;
};

export default function RecommendedProductList({ selectedSavingsProduct, filters }: Props) {
  const { data } = useSavingsProductListQuery();

  const filteredProducts = data?.filter(product => {
    const isMonthlyPayment =
      product.minMonthlyAmount < filters.monthlyPayment && product.maxMonthlyAmount > filters.monthlyPayment;
    const isTerm = product.availableTerms === filters.term;

    return isMonthlyPayment && isTerm;
  });

  const recommendedProducts = filteredProducts?.sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  return (
    <>
      {recommendedProducts?.map(product => (
        <ListRow
          key={product.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${product.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${product.minMonthlyAmount.toLocaleString('ko-KR')}원 ~ ${product.maxMonthlyAmount.toLocaleString('ko-KR')}원 | ${product.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={selectedSavingsProduct?.id === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null}
        />
      ))}
    </>
  );
}
