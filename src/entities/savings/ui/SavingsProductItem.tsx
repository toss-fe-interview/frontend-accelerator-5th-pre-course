import { ComponentProps } from 'react';
import { Assets, colors, ListRow } from 'tosslib';
import { SavingsProduct } from '../model';

type SavingsProductItemProps = {
  product: SavingsProduct;
  checked?: boolean;
  onClick?: ComponentProps<typeof ListRow>['onClick'];
};

const CheckCircleGreen = () => <Assets.Icon name="icon-check-circle-green" />;

const SavingsProductItem = ({ product, checked = false, onClick }: SavingsProductItemProps) => {
  return (
    <ListRow
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
      right={checked && <CheckCircleGreen />}
      onClick={onClick}
    />
  );
};

export default SavingsProductItem;
