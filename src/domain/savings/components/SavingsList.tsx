import { SavingsResponse } from 'domain/savings/api/type';
import { SavingItem } from 'domain/savings/components/SavingItem';

interface Props {
  savings: SavingsResponse[];
  selectedSaving: SavingsResponse | null;
  onSelectSaving: (saving: SavingsResponse | null) => void;
}

export const SavingsList = ({ savings, selectedSaving, onSelectSaving }: Props) => {
  return savings.map(saving => (
    <SavingItem
      key={saving.id}
      saving={saving}
      isSelected={selectedSaving?.id === saving.id}
      onSelect={onSelectSaving}
    />
  ));
};
