import { ChangeEvent } from 'react';
import { TextField } from 'tosslib';
import { formatNumberWithComma } from '../utils/format/number';

interface LabeledAmountInputProps {
  label: string;
  placeholder: string;
  unit: string;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function LabeledAmountInput({ label, placeholder, unit, value, onChange }: LabeledAmountInputProps) {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      suffix={unit}
      value={formatNumberWithComma(value)}
      onChange={onChange}
    />
  );
}
