import { SelectBottomSheet } from 'tosslib';

interface SavingPeriodSelectProps {
  title: string;
  value: number;
  onSelect: (value: number) => void;
  options: Array<{ value: number; label: string }>;
}

export const SavingPeriodSelect = ({ title, value, onSelect, options }: SavingPeriodSelectProps) => {
  return (
    <SelectBottomSheet
      title={title}
      value={value}
      onChange={value => {
        onSelect(value);
      }}
    >
      {options.map(option => (
        <SelectBottomSheet.Option key={option.value} value={option.value}>
          {option.label}
        </SelectBottomSheet.Option>
      ))}
    </SelectBottomSheet>
  );
};
