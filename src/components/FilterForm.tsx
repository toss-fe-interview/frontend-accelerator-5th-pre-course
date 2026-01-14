import { useEffect, useMemo, useState } from 'react';
import {
  Assets,
  Border,
  colors,
  isHttpError,
  ListHeader,
  ListRow,
  NavigationBar,
  SelectBottomSheet,
  Spacing,
  Tab,
  TextField,
} from 'tosslib';
import { addComma } from 'utils/add-comma';

interface FilterFormProps {
  targetAmount?: number;
  monthlyAmount?: number;
  term?: number;
  onTargetAmountChange: (value: number | undefined) => void;
  onMonthlyAmountChange: (value: number | undefined) => void;
  onTermChange: (value: number) => void;
}

const AVAILABLE_TERMS = [6, 12, 24] as const;

export const FilterForm = ({
  targetAmount,
  monthlyAmount,
  term,
  onTargetAmountChange,
  onMonthlyAmountChange,
  onTermChange,
}: FilterFormProps) => {
  const handleTargetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    onTargetAmountChange(numericValue === '' ? undefined : Number(numericValue));
  };

  const handleMonthlyAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    onMonthlyAmountChange(numericValue === '' ? undefined : Number(numericValue));
  };

  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={addComma(targetAmount)}
        onChange={handleTargetAmountChange}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={addComma(monthlyAmount)}
        onChange={handleMonthlyAmountChange}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={term}
        onChange={value => onTermChange(value)}
      >
        {AVAILABLE_TERMS.map(term => (
          <SelectBottomSheet.Option key={term} value={term}>
            {term}개월
          </SelectBottomSheet.Option>
        ))}
      </SelectBottomSheet>
    </>
  );
};
