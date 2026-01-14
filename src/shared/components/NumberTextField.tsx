import { TextField } from 'tosslib';
import { formatNumber } from 'shared/utils';
import { ChangeEvent } from 'react';

interface NumberTextFieldProps {
  label: string;
  placeholder?: string;
  suffix?: string;
  value: number | null;
  onChange: (value: number | null) => void;
}

export function NumberTextField({ label, placeholder, suffix, value, onChange }: NumberTextFieldProps) {
  const displayValue = value !== null ? formatNumber(value) : '';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericString = inputValue.replace(/,/g, '').replace(/[^0-9]/g, '');

    if (numericString === '') {
      onChange(null);
      return;
    }

    const numericValue = parseInt(numericString, 10);
    onChange(numericValue);
  };

  return (
    <TextField label={label} placeholder={placeholder} suffix={suffix} value={displayValue} onChange={handleChange} />
  );
}
