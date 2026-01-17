import { Assets, colors, ListRow } from 'tosslib';

export const SavingsProductItem = ({
  상품명,
  연이자율,
  최소월납입액,
  최대월납입액,
  저축기간,
  isSelected,
  onClick,
}: {
  상품명: string;
  연이자율: number;
  최소월납입액: number;
  최대월납입액: number;
  저축기간: number;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={상품명}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${연이자율}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${최소월납입액.toLocaleString('kr-KR')}원 ~ ${최대월납입액.toLocaleString('kr-KR')}원 | ${저축기간}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : null}
      onClick={onClick}
    />
  );
};
