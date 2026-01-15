import { TextField } from 'tosslib';

export const AmountInput = ({
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
      suffix="원"
      value={value ? value.toLocaleString('ko-KR') : ''}
      onChange={e => {
        const val = e.target.value.replace(/,/g, '');
        const isNumberString = (s: string) => /^\d+$/.test(s);
        if (val === '' || isNumberString(val)) {
          onChange(val === '' ? null : Number(val));
        }
      }}
    />
  );
};
