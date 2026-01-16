import { SelectBottomSheet } from 'tosslib';

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  label: string;
  title: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

export const Select = ({ label, title, value, options, onChange }: SelectProps) => {
  return (
    <SelectBottomSheet label={label} title={title} value={value} onChange={onChange}>
      {options.map(option => (
        <SelectBottomSheet.Option key={option.value} value={option.value}>
          {option.label}
        </SelectBottomSheet.Option>
      ))}
    </SelectBottomSheet>
  );
};
