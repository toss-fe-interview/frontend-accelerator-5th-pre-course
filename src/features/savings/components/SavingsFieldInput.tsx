import { ChangeEvent } from 'react';
import { TextField } from 'tosslib';
import { formatNumberWithComma } from '../utils/format/number';

interface SavingsFieldInputProps {
  label: string;
  placeholder: string;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function SavingsFieldInput({ label, placeholder, value, onChange }: SavingsFieldInputProps) {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      suffix="원"
      value={formatNumberWithComma(value)}
      onChange={onChange}
    />
  );
}
