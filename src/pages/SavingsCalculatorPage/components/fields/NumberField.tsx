import { ComponentProps } from 'react';
import { TextField } from 'tosslib';
import { formatCurrency } from 'utils/format';
import { onlyNumbers } from 'utils/input';

type TextFieldProps = ComponentProps<typeof TextField>;

interface Props extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value: number | null;
  onChange: (value: number | null) => void;
}

export function NumberField({ value, onChange, suffix = '원', ...props }: Props) {
  return (
    <TextField
      suffix={suffix}
      {...props}
      value={value ? formatCurrency(value) : ''}
      onChange={event => {
        const numbers = onlyNumbers(event.target.value);
        onChange(numbers ? Number(numbers) : null);
      }}
    />
  );
}
