import { TextField } from 'tosslib';
import { formatNumber, parseNumberInput } from 'utils/format';

interface NumberInputProps {
  label: string;
  placeholder?: string;
  suffix?: string;
  value: number;
  onChange: (value: number) => void;
}

const NumberInput = ({ label, placeholder, suffix, value, onChange }: NumberInputProps) => {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      suffix={suffix}
      value={value > 0 ? formatNumber(value) : ''}
      onChange={e => onChange(parseNumberInput(e.target.value))}
    />
  );
};

export default NumberInput;
