import { ComponentProps } from 'react';
import { TextField } from 'tosslib';

type TargetAmountInputProps = {
  value: string;
  onChange: ComponentProps<typeof TextField>['onChange'];
};

const TargetAmountInput = ({ value, onChange }: TargetAmountInputProps) => {
  return (
    <TextField label="목표 금액" placeholder="목표 금액을 입력하세요" suffix="원" value={value} onChange={onChange} />
  );
};

export default TargetAmountInput;
