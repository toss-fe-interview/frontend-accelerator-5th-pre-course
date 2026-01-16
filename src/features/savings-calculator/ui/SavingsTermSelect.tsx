import { SelectBottomSheet } from 'tosslib';

interface SavingsTermSelectProps {
  label: string;
  title: string;
  value: number;
  onChange: (value: number) => void;
}

export function SavingsTermSelect({ label, title, value, onChange }: SavingsTermSelectProps) {
  return (
    <SelectBottomSheet
      label={label}
      title={title}
      value={value}
      onChange={selectedValue => onChange(Number(selectedValue))}
    >
      <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
    </SelectBottomSheet>
  );
}
