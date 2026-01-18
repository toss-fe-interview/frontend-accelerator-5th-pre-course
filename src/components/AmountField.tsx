import { TextField } from 'tosslib';
import { formatAmount, parseNumber } from 'utils/format';

export function AmountField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      suffix="원"
      value={formatAmount(value)}
      onChange={e => onChange(parseNumber(e.target.value))}
    />
  );
}
