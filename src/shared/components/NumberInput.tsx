import { TextField } from 'tosslib';

type NumberInputProps = {
  label: string;
  placeholder: string;
  suffix: string;
  value: string;
  onChange: (value: string) => void;
};

export const NumberInput = ({ label, placeholder, suffix, value, onChange }: NumberInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    onChange(newValue);
  };

  return <TextField label={label} placeholder={placeholder} suffix={suffix} value={value} onChange={handleChange} />;
};
