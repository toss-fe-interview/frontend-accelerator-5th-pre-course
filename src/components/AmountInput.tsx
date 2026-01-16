import { ChangeEvent, ComponentProps } from 'react';
import { TextField } from 'tosslib';

export interface AmountInputProps extends Omit<ComponentProps<typeof TextField>, 'value' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
}

export function AmountInput({ value, onChange, ...props }: AmountInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const withoutCommas = e.target.value.replace(/,/g, '');

    const isEmptyInput = withoutCommas === '';
    const isValidNumber = /^\d+$/.test(withoutCommas);

    if (isEmptyInput) {
      onChange(0);
      return;
    }

    if (isValidNumber) {
      onChange(Number(withoutCommas));
    }
  };

  const formattedValue = value.toLocaleString();
  const displayValue = value === 0 ? '' : formattedValue;

  return (
    <TextField
      value={displayValue}
      onChange={handleChange}
      placeholder="목표 금액을 입력하세요"
      suffix="원"
      {...props}
    />
  );
}
