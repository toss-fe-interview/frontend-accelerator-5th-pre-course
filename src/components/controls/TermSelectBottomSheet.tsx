import React from 'react';
import { SelectBottomSheet } from 'tosslib';

interface TermSelectProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
}

const AVAILABLE_TERMS = [6, 12, 24] as const;

export const TermSelectBottomSheet = ({ label, value, onValueChange }: TermSelectProps) => {
  return (
    <SelectBottomSheet
      label={label}
      title={`${label}을 선택해주세요`}
      value={value}
      onChange={value => onValueChange(value)}
    >
      {AVAILABLE_TERMS.map(term => (
        <SelectBottomSheet.Option key={term} value={term}>
          {term}개월
        </SelectBottomSheet.Option>
      ))}
    </SelectBottomSheet>
  );
};
