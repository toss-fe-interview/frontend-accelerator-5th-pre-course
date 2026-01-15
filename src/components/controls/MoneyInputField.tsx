import React from 'react';
import { TextField } from 'tosslib';
import { addComma } from 'utils/add-comma';

interface InputFieldProps {
  label: string;
  value: number | undefined;
  onValueChange: (value: number | undefined) => void;
}
export const MoneyInputField = ({ label, value, onValueChange }: InputFieldProps) => {
  const handleMoneyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '');
    onValueChange(digitsOnly === '' ? undefined : Number(digitsOnly));
  };

  return (
    <TextField
      label={label}
      placeholder={`${label}을 입력하세요`}
      suffix="원"
      value={addComma(value)}
      onChange={handleMoneyInputChange}
    />
  );
};
