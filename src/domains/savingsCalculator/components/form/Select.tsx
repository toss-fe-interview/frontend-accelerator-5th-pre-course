import { SelectBottomSheet } from 'tosslib';

interface SelectProps<T> {
  label: string;
  title: string;
  selectedValue: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}

export default function Select<T extends string | number>({
  label,
  title,
  selectedValue,
  options,
  onChange,
}: SelectProps<T>) {
  return (
    <SelectBottomSheet label={label} title={title} value={selectedValue} onChange={value => onChange(value)}>
      {options.map(option => (
        <SelectBottomSheet.Option key={option.value} value={option.value}>
          {option.label}
        </SelectBottomSheet.Option>
      ))}
    </SelectBottomSheet>
  );
}
