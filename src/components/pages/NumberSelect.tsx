import { SelectBottomSheet } from 'tosslib';
import { useFormContext } from 'react-hook-form';
import { Controller } from 'react-hook-form';

export const NumberSelect = ({
  name,
  label,
  placeholder,
  options,
}: {
  name: string;
  label: string;
  placeholder: string;
  options: { value: number; label: string }[];
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <SelectBottomSheet label={label} title={placeholder} {...field}>
          {options.map(option => (
            <SelectBottomSheet.Option key={option.value} value={option.value}>
              {option.label}
            </SelectBottomSheet.Option>
          ))}
        </SelectBottomSheet>
      )}
    />
  );
};
