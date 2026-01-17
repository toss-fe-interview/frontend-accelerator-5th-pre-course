import { ComponentProps } from 'react';
import { TextField } from 'tosslib';

type MonthlyDepositInputProps = {
  value: string;
  onChange: ComponentProps<typeof TextField>['onChange'];
};

const MonthlyDepositInput = ({ value, onChange }: MonthlyDepositInputProps) => {
  return (
    <TextField
      label="월 납입액"
      placeholder="희망 월 납입액을 입력하세요"
      suffix="원"
      value={value}
      onChange={onChange}
    />
  );
};

export default MonthlyDepositInput;
