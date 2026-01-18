import { SelectBottomSheet } from 'tosslib';

export const SavingsTermSelect = ({
  label,
  placeholder,
  value,
  onSelect,
  options,
}: {
  label: string;
  placeholder: string;
  value: number;
  onSelect: (value: number) => void;
  options: { value: number; label: string }[];
}) => {
  return (
    <SelectBottomSheet value={value} onChange={onSelect} label={label} title={placeholder}>
      {options.map(option => (
        <SelectBottomSheet.Option key={option.value} value={option.value}>
          {option.label}
        </SelectBottomSheet.Option>
      ))}
    </SelectBottomSheet>
  );
};
