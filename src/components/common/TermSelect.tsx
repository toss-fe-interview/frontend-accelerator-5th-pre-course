import { SelectBottomSheet, Spacing } from 'tosslib';

interface TermSelectProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function TermSelect({ label, value, onChange }: TermSelectProps) {
  return (
    <>
      <Spacing size={16} />
      <SelectBottomSheet label={label} title="저축 기간을 선택해주세요" value={value} onChange={onChange}>
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
}
