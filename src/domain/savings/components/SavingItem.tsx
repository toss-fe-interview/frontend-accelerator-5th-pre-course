import { SavingsResponse } from 'domain/savings/api/type';
import { Assets, colors, ListRow } from 'tosslib';

interface Props {
  saving: SavingsResponse;
  isSelected: boolean;
  onSelect: (saving: SavingsResponse | null) => void;
}

export const SavingItem = ({ saving, isSelected, onSelect }: Props) => {
  return (
    <ListRow
      key={saving.id}
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={'기본 정기적금'}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${saving.annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${saving.minMonthlyAmount.toLocaleString()}원 ~ ${saving.maxMonthlyAmount.toLocaleString()}원 | ${saving.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={isSelected && <Assets.Icon name="icon-check-circle-green" />}
      onClick={() => {
        if (isSelected) {
          onSelect(null);
          return;
        }
        onSelect(saving);
      }}
    />
  );
};
