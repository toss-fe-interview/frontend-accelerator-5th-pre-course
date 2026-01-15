import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from 'tosslib';

export const KRWInput = ({ name, label, placeholder }: { name: string; label: string; placeholder: string }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          label={label}
          placeholder={placeholder}
          suffix="원"
          value={field.value ? field.value.toLocaleString('ko-KR') : ''}
          onChange={e => {
            const value = e.target.value.replace(/,/g, '');
            if (value === '' || /^\d+$/.test(value)) {
              field.onChange(value === '' ? null : Number(value));
            }
          }}
        />
      )}
    />
  );
};
