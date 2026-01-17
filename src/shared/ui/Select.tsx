import { SelectBottomSheet } from 'tosslib';

type SelectOption<T> = {
  value: T;
  label: string;
};

type SelectProps<T> = {
  label: string;
  title: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<SelectOption<T>>;
};

export function Select<T>({ label, title, value, onChange, options }: SelectProps<T>) {
  return (
    <SelectBottomSheet label={label} title={title} value={value} onChange={onChange}>
      {options.map(option => (
        <SelectBottomSheet.Option key={String(option.value)} value={option.value}>
          {option.label}
        </SelectBottomSheet.Option>
      ))}
    </SelectBottomSheet>
  );
}
