import { SelectBottomSheet } from 'tosslib';

interface PeriodSelectorProps {
  value?: number;
  onChange?: (value: number) => void;
}

export function PeriodSelector({ value = 12, onChange }: PeriodSelectorProps) {

  return (
    <SelectBottomSheet
      label="저축 기간"
      title="저축 기간을 선택해주세요"
      value={value}
      onChange={(v) => onChange?.(v as number)}
    >
      <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
    </SelectBottomSheet>
  );
}
