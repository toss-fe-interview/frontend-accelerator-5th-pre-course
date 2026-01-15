import { ChangeEvent } from 'react';
import { TextField } from 'tosslib';
import { formatNumberWithComma } from '../utils/format/number';

interface SavingsFieldInputProps {
  label: string;
  placeholder: string;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function SavingsFieldInput({ value, onChange }: SavingsFieldInputProps) {
  return (
    <TextField
      label="목표 금액"
      placeholder="목표 금액을 입력하세요"
      suffix="원"
      value={formatNumberWithComma(value)}
      onChange={onChange}
    />
  );
}
