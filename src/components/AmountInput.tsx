import { ComponentProps } from 'react';
import { TextField } from 'tosslib';

export interface AmountInputProps extends Omit<ComponentProps<typeof TextField>, 'value' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
}

export function AmountInput({ value, onChange, ...props }: AmountInputProps) {
  return (
    <TextField
      value={value.toLocaleString()}
      onChange={e => {
        const rawValue = e.target.value.replace(/,/g, '');
        if (rawValue === '') {
          onChange(0);
          return;
        }

        if (!/^\d+$/.test(rawValue)) {
          return;
        }
        onChange(Number(rawValue));
      }}
      placeholder="목표 금액을 입력하세요"
      suffix="원"
      {...props}
    />
  );
}
