import { toCurrency, toNumber } from 'shared/utils/format';
import { TextField } from 'tosslib';

interface MonthlyAmountFieldProps {
  value: number;
  label: string;
  onChange: (value: number) => void;
}

export default function MonthlyAmountField({ value, label, onChange }: MonthlyAmountFieldProps) {
  return (
    <TextField
      label={label}
      placeholder="희망 월 납입액을 입력하세요"
      suffix="원"
      value={toCurrency(value)}
      onChange={e => onChange(toNumber(e.target.value))}
    />
  );
}
