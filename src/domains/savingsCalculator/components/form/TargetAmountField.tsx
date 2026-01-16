import { formatCurrency, toNumber } from 'shared/utils/format';
import { TextField } from 'tosslib';

interface TargetAmountFieldProps {
  value: number;
  label: string;
  onChange: (value: number) => void;
}

export default function TargetAmountField({ value, label, onChange }: TargetAmountFieldProps) {
  return (
    <TextField
      label={label}
      placeholder="목표 금액을 입력하세요"
      suffix="원"
      value={formatCurrency(value)} // format도 결국 어떻게 보여줄지에 대한 how 라고 생각해 컴포넌트 내부에 넣었다.
      onChange={e => onChange(toNumber(e.target.value))}
    />
  );
}
