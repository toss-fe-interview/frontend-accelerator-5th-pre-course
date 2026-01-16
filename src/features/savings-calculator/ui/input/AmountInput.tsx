import { ChangeEvent } from 'react';
import { TextField } from 'tosslib';

import { formatTextFieldValue } from 'shared/lib/formatTextFieldValue';
import { sanitizeAmount } from 'shared/lib/sanitizeAmount';
import { validateAmount } from 'shared/lib/validateAmount';

interface AmountInputProps {
  label: string;
  placeholder: string;
  suffix: string;
  value: number;
  onChange: (value: number) => void;
}

export function AmountInput({ label, placeholder, suffix, value, onChange }: AmountInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === '') {
      onChange(0);
      return;
    }

    const sanitizedValue = sanitizeAmount(rawValue);
    if (validateAmount(sanitizedValue)) {
      onChange(sanitizedValue);
    }
  };

  return (
    <TextField
      label={label}
      placeholder={placeholder}
      suffix={suffix}
      value={formatTextFieldValue(value)}
      onChange={handleChange}
    />
  );
}
