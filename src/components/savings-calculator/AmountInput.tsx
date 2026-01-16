import { TextField } from 'tosslib';

import { formatTextFieldValue } from 'utils/formatTextFieldValue';
import { sanitizeAmount } from 'utils/sanitizeAmount';
import { validateAmount } from 'utils/validateAmount';

interface AmountInputProps {
  label: string;
  placeholder: string;
  suffix: string;
  value: number;
  onChange: (value: number) => void;
}

export function AmountInput({ label, placeholder, suffix, value, onChange }: AmountInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      onChange(0);
      return;
    }
    const sanitizedValue = sanitizeAmount(inputValue);
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
