import { SelectBottomSheet } from 'tosslib';

type SavingBottomSheetProps = {
  terms: string;
  onTermsChange: (value: string) => void;
};

export const SavingBottomSheet = ({ terms, onTermsChange }: SavingBottomSheetProps) => {
  return (
    <SelectBottomSheet
      label="저축 기간"
      title="저축 기간을 선택해주세요"
      value={terms}
      onChange={value => onTermsChange(value)}
    >
      <SelectBottomSheet.Option value="6">6개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value="12">12개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value="24">24개월</SelectBottomSheet.Option>
    </SelectBottomSheet>
  );
};
