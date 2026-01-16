import { TextField } from 'tosslib';

type NumberInputProps = {
  label: string;
  placeholder: string;
  suffix: string;
  value: number | null;
  onChange: (value: number | null) => void;
};

export const NumberInput = ({ label, placeholder, suffix, value, onChange }: NumberInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericString = e.target.value.replace(/[^0-9]/g, '');
    onChange(numericString === '' ? null : parseInt(numericString));
  };

  const displayValue = value === null ? '' : String(value);

  return (
    <TextField label={label} placeholder={placeholder} suffix={suffix} value={displayValue} onChange={handleChange} />
  );
};
