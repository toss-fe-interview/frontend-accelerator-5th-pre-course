import { TERMS_OPTIONS } from 'product/constants';
import { SelectBottomSheet } from 'tosslib';

interface Props {
  value: number | null;
  onChange: (value: number) => void;
}

const TermSelectBottomSheet = ({ value, onChange }: Props) => {
  return (
    <SelectBottomSheet
      label="저축 기간"
      title="저축 기간을 선택해주세요"
      value={value}
      onChange={value => {
        if (value === null) {
          return;
        }

        onChange(value);
      }}
    >
      {TERMS_OPTIONS.map(option => (
        <SelectBottomSheet.Option key={option.value} value={option.value}>
          {option.label}
        </SelectBottomSheet.Option>
      ))}
    </SelectBottomSheet>
  );
};

export default TermSelectBottomSheet;
