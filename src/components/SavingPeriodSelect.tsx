import { SelectBottomSheet } from 'tosslib';

interface SavingPeriodSelectProps {
  value: number;
  onChange: (value: number) => void;
}

export const SavingPeriodSelect = ({ value, onChange }: SavingPeriodSelectProps) => {
  return (
    <SelectBottomSheet
      title="저축 기간을 선택해주세요"
      value={value}
      onChange={value => {
        onChange(value);
      }}
    >
      <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
    </SelectBottomSheet>
  );
};
