import { TextField } from 'tosslib';
import type { ComponentProps } from 'react';

type TextFieldProps = ComponentProps<typeof TextField>;

type NumberInputProps = Omit<TextFieldProps, 'value' | 'onChange'> & {
  value: number | undefined;
  onChange: (value: number) => void;
};

export function NumberInput({ value, onChange, ...rest }: NumberInputProps) {
  return (
    <TextField
      {...rest}
      value={value ? value.toString() : ''}
      onChange={event => {
        const numericValue = event.target.value.replace(/[^0-9]/g, '');
        onChange(numericValue ? Number(numericValue) : 0);
      }}
    />
  );
}
