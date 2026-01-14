import React, { ChangeEvent } from 'react';
import { TextField } from 'tosslib';

interface Props {
  label?: string;
  placeholder?: string;
  suffix?: string;
  locale?: string;
  value: number;
  max?: number;
  onValueChange: (value: number) => void;
}

export default function MoneyTextField({
  label,
  placeholder,
  suffix,
  locale,
  value,
  max = Number.MAX_SAFE_INTEGER,
  onValueChange,
}: Props) {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const onlyNumStr = value.replace(/\D/g, '');
    const numValue = Number(onlyNumStr);
    if (numValue < Math.min(max, Number.MAX_SAFE_INTEGER)) {
      onValueChange(numValue);
    }
  };

  return (
    <TextField
      label={label}
      placeholder={placeholder}
      suffix={suffix}
      value={value.toLocaleString(locale)}
      onChange={onChange}
    />
  );
}
