import { defaultTo } from 'es-toolkit/compat';
import React from 'react';
import { TextField } from 'tosslib';
import { addComma } from 'utils/add-comma';

interface InputFieldProps {
  label: string;
  value: number | undefined;
  onValueChange: (value: number | undefined) => void;
}

/**
 * 입력 문자열에서 숫자만 추출하는 함수
 */
const extractDigits = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const MoneyInputField = ({ label, value, onValueChange }: InputFieldProps) => {
  return (
    <TextField
      label={label}
      placeholder={`${label}을 입력하세요`}
      suffix="원"
      value={addComma(value) ?? ''}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const extractedDigits = extractDigits(e.target.value);
        const parsedNumber = extractedDigits === '' ? undefined : Number(extractedDigits);

        onValueChange(defaultTo(parsedNumber, undefined));
      }}
    />
  );
};
