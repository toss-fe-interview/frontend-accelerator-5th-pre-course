import { TextField } from 'tosslib';
import { z } from 'zod';

const numericInputSchema = z.string().transform(val => {
  const numericString = val.replace(/[^0-9]/g, '');
  const num = Number(numericString);
  return isNaN(num) ? 0 : num;
});

export const NumberInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) => {
  return (
    <TextField
      label={label}
      placeholder={`${label}을 입력하세요`}
      suffix="원"
      value={value.toLocaleString('ko-KR')}
      onChange={e => {
        const result = numericInputSchema.safeParse(e.target.value);
        if (result.success) {
          onChange(result.data);
        }
      }}
    />
  );
};
