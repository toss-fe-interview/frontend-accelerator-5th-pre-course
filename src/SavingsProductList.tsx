import { useSavingsProductListQuery } from 'services/useSavingsProductListQuery';
import { Assets, colors, ListRow } from 'tosslib';

export default function SavingsProductList() {
  const { data } = useSavingsProductListQuery();

  return (
    <>
      {data?.map(product => (
        <ListRow
          key={product.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${product.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${product.minMonthlyAmount}원 ~ ${product.maxMonthlyAmount}원 | ${product.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={<Assets.Icon name="icon-check-circle-green" />}
          onClick={() => {}}
        />
      ))}
    </>
  );
}
