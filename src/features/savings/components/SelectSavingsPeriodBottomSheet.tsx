import { SelectBottomSheet } from 'tosslib';

const SelectSavingsPeriodBottomSheet = ({
  label,
  period,
  onChange,
}: {
  label: string;
  period: number;
  onChange: (value: number) => void;
}) => {
  return (
    <SelectBottomSheet label={label} title="저축 기간을 선택해주세요" value={period} onChange={onChange}>
      <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
    </SelectBottomSheet>
  );
};

export default SelectSavingsPeriodBottomSheet;
