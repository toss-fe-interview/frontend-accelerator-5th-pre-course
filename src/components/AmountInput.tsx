import { TextField } from 'tosslib';

type Props = {
  label: string;
  placeholder: string;
  value: number;
  onChange: (value: number) => void;
};

export default function AmountInput({ label, placeholder, value, onChange }: Props) {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      suffix="원"
      value={value.toLocaleString('ko-KR')}
      onChange={e => onChange(Number(e.target.value.replace(/,/g, '')))}
    />
  );
}
