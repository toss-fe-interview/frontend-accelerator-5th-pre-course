import { ListRow, Assets, colors } from 'tosslib';

export interface ProductItemProps {
  name: string;
  id:string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  period: number;
  selected: string | null; 
  onClick?: () => void;
}

export function ProductItem({
  name,
  id,
  interestRate,
  minAmount,
  maxAmount,
  period,
  selected,
  onClick,
}: ProductItemProps) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${interestRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${minAmount.toLocaleString()}원 ~ ${maxAmount.toLocaleString()}원 | ${period}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={selected === id ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
      onClick={onClick}
    />
  );
}
