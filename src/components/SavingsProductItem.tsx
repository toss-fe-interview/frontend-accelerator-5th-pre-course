import { SavingProduct } from 'queries/types';
import { Assets, colors, ListRow } from 'tosslib';

export const SavingsProductItem = ({
  product,
  checked,
  onClick,
}: {
  product: SavingProduct;
  checked: boolean;
  onClick: () => void;
}) => {
  return (
    <ListRow
      key={product.id}
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={product.name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${product.annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${product.minMonthlyAmount.toLocaleString('kr-KR')}원 ~ ${product.maxMonthlyAmount.toLocaleString('kr-KR')}원 | ${product.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={checked ? <Assets.Icon name="icon-check-circle-green" /> : null}
      onClick={onClick}
    />
  );
};
