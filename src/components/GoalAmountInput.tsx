import { TextField } from 'tosslib';

interface GoalAmountInputProps {
  value: number;
  onChange: (value: number) => void;
}

export const GoalAmountInput = ({ value, onChange }: GoalAmountInputProps) => {
  return (
    <TextField
      label="목표 금액"
      placeholder="목표 금액을 입력하세요"
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
