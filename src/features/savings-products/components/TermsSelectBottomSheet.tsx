import { SelectBottomSheet } from 'tosslib';

type TermsSelectBottomSheetProps = {
  terms: string;
  onTermsChange: (value: string) => void;
};

export const TermsSelectBottomSheet = ({ terms, onTermsChange }: TermsSelectBottomSheetProps) => {
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
