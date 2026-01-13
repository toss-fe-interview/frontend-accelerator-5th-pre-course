import { TextField } from 'tosslib';

export const TextFieldForKRW = ({
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
        const value = e.target.value.replace(/,/g, '');
        if (value === '' || /^\d+$/.test(value)) {
          onChange(value === '' ? null : Number(value));
        }
      }}
    />
  );
};
