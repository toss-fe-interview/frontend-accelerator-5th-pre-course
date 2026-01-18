import { toCurrency, toNumber } from 'shared/utils/format';
import { TextField } from 'tosslib';

interface CurrencyInputProps {
  label: string;
  value: number;
  placeholder?: string;
  unit?: string;
  locale?: string;
  onChange: (value: number) => void;
}

export default function CurrencyInput({
  label,
  value,
  placeholder,
  unit = '원',
  locale = 'ko-KR',
  onChange,
}: CurrencyInputProps) {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      suffix={unit}
      value={toCurrency(value, { locale })}
      onChange={e => onChange(toNumber(e.target.value))}
    />
  );
}
