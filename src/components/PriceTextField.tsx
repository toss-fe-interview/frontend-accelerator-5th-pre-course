import { TextField } from 'tosslib';
import { priceFormatterToString, priceParserToNumber } from 'utils/priceFormatter';

interface PriceTextFieldProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  placeholder: string;
}
export const PriceTextField = ({ value, onChange, label, placeholder }: PriceTextFieldProps) => {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      suffix="원"
      value={priceFormatterToString(value)}
      onChange={e => onChange(priceParserToNumber(e.target.value))}
    />
  );
};
