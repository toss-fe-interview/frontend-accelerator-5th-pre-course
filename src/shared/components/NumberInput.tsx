import { TextField } from 'tosslib';

type NumberInputProps = {
  label: string;
  placeholder: string;
  suffix: string;
  value: number;
  onChange: (value: number) => void;
};

// 얘는... number만 입력받도록 하는 인풋이야...
// 근데!! 요구사항에는 표시만 원단위지
// 아니 근데 그걸 NumberInput이라고 할 수 있나?
export const NumberInput = ({ label, placeholder, suffix, value, onChange }: NumberInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericString = e.target.value.replace(/[^0-9]/g, '');
    onChange(numericString === '' ? 0 : parseInt(numericString, 10));
  };

  const displayValue = value === 0 ? '' : String(value);

  return (
    <TextField label={label} placeholder={placeholder} suffix={suffix} value={displayValue} onChange={handleChange} />
  );
};
