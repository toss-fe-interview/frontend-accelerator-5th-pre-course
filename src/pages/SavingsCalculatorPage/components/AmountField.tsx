import { TextField } from 'tosslib';

interface AmountFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * 금액 입력 필드
 *
 * 본질: "금액을 입력받는다"
 * - 금액이면 당연히 숫자만 입력받고, 당연히 "원" suffix가 붙음
 * - 사용하는 쪽에서는 label, placeholder, value, onChange만 신경쓰면 됨
 */
export function AmountField({ label, placeholder, value, onChange }: AmountFieldProps) {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      suffix="원"
      value={value}
      onChange={e => {
        const numericValue = e.target.value.replace(/[^0-9]/g, '');
        onChange(numericValue);
      }}
    />
  );
}
