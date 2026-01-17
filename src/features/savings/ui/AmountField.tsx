import { TextField } from 'tosslib';

// 변수명 고민
const AmountField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <TextField label={label} placeholder={`${label}을 입력하세요`} suffix="원" value={value} onChange={onChange} />
  );
};

export default AmountField;
