import { ChangeEvent } from 'react';
import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { formatNumber } from 'shared/utils';

interface SavingsCalculatorInputsProps {
  goalAmount: number | null;
  monthlyAmount: number | null;
  term: number;
  onGoalAmountChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onMonthlyAmountChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTermChange: (value: number) => void;
}

export function SavingsCalculatorInputs({
  goalAmount,
  monthlyAmount,
  term,
  onGoalAmountChange,
  onMonthlyAmountChange,
  onTermChange,
}: SavingsCalculatorInputsProps) {
  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={goalAmount !== null ? formatNumber(goalAmount) : ''}
        onChange={onGoalAmountChange}
      />

      <Spacing size={16} />

      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyAmount !== null ? formatNumber(monthlyAmount) : ''}
        onChange={onMonthlyAmountChange}
      />

      <Spacing size={16} />

      <SelectBottomSheet label="저축 기간" title="저축 기간을 선택해주세요" value={term} onChange={onTermChange}>
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
}
