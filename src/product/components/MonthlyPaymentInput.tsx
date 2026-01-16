import { TextField } from 'tosslib';

interface Props {
  value: string;
  onChange: (value: string) => void;
}
const MonthlyPaymentInput = ({ value, onChange }: Props) => {
  return (
    <TextField
      label="월 납입액"
      placeholder="희망 월 납입액을 입력하세요"
      suffix="원"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
};

export default MonthlyPaymentInput;
