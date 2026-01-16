import { SelectBottomSheet } from 'tosslib';

type Term = 6 | 12 | 24;

interface TermFieldProps {
  value: Term;
  label: string;
  onChange: (value: Term) => void;
}

export default function TermField({ value, label, onChange }: TermFieldProps) {
  return (
    <SelectBottomSheet
      label={label}
      title="저축 기간을 선택해주세요"
      value={value}
      onChange={value => onChange(value as Term)}
    >
      <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
    </SelectBottomSheet>
  );
}
