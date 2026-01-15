import { SelectBottomSheet } from 'tosslib';

interface SavingTermsSelectProps {
  value: number;
  onChange: (value: number) => void;
}
export function SavingTermsSelect({ value, onChange }: SavingTermsSelectProps) {
  return (
    <SelectBottomSheet
      label="저축 기간"
      title="저축 기간을 선택해주세요"
      value={value}
      onChange={value => onChange(value)}
    >
      <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
    </SelectBottomSheet>
  );
}
