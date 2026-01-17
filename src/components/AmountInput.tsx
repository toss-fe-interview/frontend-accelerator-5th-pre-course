import { TextField } from 'tosslib';

const AmountInput = ({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: number | null;
  onChange: (value: number | null) => void;
}) => {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      value={value ? value.toLocaleString('ko-KR') : ''}
      suffix="원"
      onChange={e => {
        const rawValue = e.target.value.replace(/,/g, '');
        onChange(rawValue ? Number(rawValue) : null);
      }}
    />
  );
};

export default AmountInput;
