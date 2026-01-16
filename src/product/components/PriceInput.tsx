import { TextField } from 'tosslib';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const PriceInput = ({ value, onChange }: Props) => {
  return (
    <TextField
      label="목표 금액"
      placeholder="목표 금액을 입력하세요"
      suffix="원"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
};

export default PriceInput;
