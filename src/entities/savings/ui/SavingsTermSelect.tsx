import { SelectBottomSheet } from 'tosslib';

type SavingsTermSelectProps = {
  value: number;
  onChange: (value: number) => void;
  options: number[];
};

const SavingsTermSelect = ({ value, onChange, options: terms }: SavingsTermSelectProps) => {
  return (
    <SelectBottomSheet label="저축 기간" title="저축 기간을 선택해주세요" value={value} onChange={onChange}>
      {terms.map(term => (
        <SelectBottomSheet.Option key={term} value={term}>
          {`${term}개월`}
        </SelectBottomSheet.Option>
      ))}
    </SelectBottomSheet>
  );
};

export default SavingsTermSelect;
