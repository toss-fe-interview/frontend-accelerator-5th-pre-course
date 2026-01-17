import { SelectBottomSheet } from 'tosslib';

interface TermsSelectProps {
  title: string;
  value: number;
  onSelect: (value: number) => void;
  options: Array<{ value: number; label: string }>;
}

export const TermsSelect = ({ title, value, onSelect, options }: TermsSelectProps) => {
  return (
    <SelectBottomSheet
      title={title}
      value={value}
      onChange={value => {
        onSelect(value);
      }}
    >
      {options.map(option => (
        <SelectBottomSheet.Option key={option.value} value={option.value}>
          {option.label}
        </SelectBottomSheet.Option>
      ))}
    </SelectBottomSheet>
  );
};
