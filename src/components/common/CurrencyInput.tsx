import { Spacing, TextField } from 'tosslib';
import { extractDigits } from 'utils/number';

interface CurrencyInputProps {
  label: string;
  field: string;
  value: string;
  onChange: (partial: Record<string, string>) => void;
}

export function CurrencyInput({ label, field, value, onChange }: CurrencyInputProps) {
  return (
    <>
      <Spacing size={16} />
      <TextField
        label={label}
        placeholder={`${label}을 입력하세요`}
        suffix="원"
        value={value}
        onChange={e => onChange({ [field]: extractDigits(e.target.value) })}
      />
    </>
  );
}
