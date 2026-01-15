import type { ComponentPropsWithoutRef } from 'react';
import { TextField } from 'tosslib';
import z from 'zod';

interface NumberFieldProps extends Omit<ComponentPropsWithoutRef<typeof TextField>, 'value' | 'onChange'> {
  value?: number;
  onValueChange: (value: number) => void;
}

function NumberField({ label, placeholder, suffix, value, onValueChange }: NumberFieldProps) {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      suffix={suffix}
      value={value == null ? '' : value.toLocaleString()}
      onChange={event => {
        const value = event.target.value.split(',').join('');
        const parsed = z.coerce.number().safeParse(value);
        if (parsed.success) {
          onValueChange(parsed.data);
        }
      }}
    />
  );
}

export { NumberField };
