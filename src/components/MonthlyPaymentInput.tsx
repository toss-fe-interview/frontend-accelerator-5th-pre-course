import { TextField } from 'tosslib';

interface MonthlyPaymentInputProps {
  value: number;
  onChange: (value: number) => void;
}

export const MonthlyPaymentInput = ({ value, onChange }: MonthlyPaymentInputProps) => {
  return (
    <TextField
      label="월 납입액"
      placeholder="월 납입액을 입력하세요"
      suffix="원"
      value={value.toString()}
      onChange={e => {
        if (isNaN(Number(e.target.value))) {
          return;
        }
        onChange(Number(e.target.value));
      }}
    />
  );
};
