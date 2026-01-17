import { TextField } from 'tosslib';
import { formatToKRW, parseNumber } from '../util';

export function KorNumInput({
  value,
  label,
  placeholder,
  onChange,
}: {
  value: number;
  label: string;
  placeholder: string;
  onChange: (value: number) => void;
}) {
  const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseNumber(e.target.value);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      suffix="원"
      value={formatToKRW(value)}
      onChange={handleNumChange}
    />
  );
}
