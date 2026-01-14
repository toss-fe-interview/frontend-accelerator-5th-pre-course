import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { SavingsValues } from '../types/savingsValues';
import { ChangeEvent } from 'react';
import { formatNumberWithComma } from '../utils/format/number';

interface SavingsInputsProps {
  savingsValues: SavingsValues;
  onChangeTargetAmount: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeMonthlyPaymentAmount: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeSavingsPeriod: (newValue: number) => void;
}

const SAVINGS_PERIOD_OPTIONS = [6, 12, 18, 24] as const;

export default function SavingsInputs({
  savingsValues,
  onChangeTargetAmount,
  onChangeMonthlyPaymentAmount,
  onChangeSavingsPeriod,
}: SavingsInputsProps) {
  const { targetAmount, monthlyPaymentAmount, savingsPeriod } = savingsValues;
  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={formatNumberWithComma(targetAmount)}
        onChange={onChangeTargetAmount}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={formatNumberWithComma(monthlyPaymentAmount)}
        onChange={onChangeMonthlyPaymentAmount}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsPeriod}
        onChange={onChangeSavingsPeriod}
      >
        {SAVINGS_PERIOD_OPTIONS.map(period => (
          <SelectBottomSheet.Option key={period} value={period}>
            {period}개월
          </SelectBottomSheet.Option>
        ))}
      </SelectBottomSheet>
    </>
  );
}
