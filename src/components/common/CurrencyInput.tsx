import { Spacing, TextField } from 'tosslib';
import { extractDigits } from 'utils/number';

interface CurrencyInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function CurrencyInput({ label, value, onChange }: CurrencyInputProps) {
  return (
    <>
      <Spacing size={16} />
      <TextField
        label={label}
        placeholder={`${label}을 입력하세요`}
        suffix="원"
        value={value}
        onChange={e => onChange(extractDigits(e.target.value))}
      />
    </>
  );
}
