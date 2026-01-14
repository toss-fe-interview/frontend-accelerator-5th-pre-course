import { Spacing, TextField } from 'tosslib';

interface MonthlyDepositInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function MonthlyDepositInput({ value, onChange }: MonthlyDepositInputProps) {
  
  return (
    <>
    <TextField
      label="월 납입액"
      placeholder="희망 월 납입액을 입력하세요"
      suffix="원"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
    <Spacing size={16} />
    </>
  );
}
