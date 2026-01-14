import { TextField, Spacing } from 'tosslib';

interface GoalAmountInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function GoalAmountInput({ value, onChange }: GoalAmountInputProps) {

  return (
    <>
    <TextField
      label="목표 금액"
      placeholder="목표 금액을 입력하세요"
      suffix="원"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
    <Spacing size={16} />
    </>
  );
}
