import { ChangeEvent } from 'react';
import { TextField } from 'tosslib';
import { formatNumberWithComma } from '../utils/format/number';
import { parseNumberInput } from '../utils/parse/number';

interface LabeledAmountInputProps {
  label: string;
  placeholder: string;
  unit: string;
  value: number;
  onChange: (newValue: number) => void;
}

export default function LabeledNumberInput({ label, placeholder, unit, value, onChange }: LabeledAmountInputProps) {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      suffix={unit}
      value={formatNumberWithComma(value)}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        const newValue = parseNumberInput(e.target.value);

        onChange(newValue);
      }}
    />
  );
}
