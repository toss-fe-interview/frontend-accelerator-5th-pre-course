import { SelectBottomSheet } from 'tosslib';

interface SavingPeriodSelectProps {
  value: number;
  onChange: (value: number) => void;
  options: Array<{ value: number; label: string }>;
}

export const SavingPeriodSelect = ({ value, onChange, options }: SavingPeriodSelectProps) => {
  return (
    <SelectBottomSheet
      title="저축 기간을 선택해주세요"
      value={value}
      onChange={value => {
        onChange(value);
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
