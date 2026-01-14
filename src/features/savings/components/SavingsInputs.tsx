import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { SavingsValues } from '../types/savingsValues';
import { ChangeEvent } from 'react';
import { formatNumberWithComma } from '../utils/format/number';

interface SavingsInputsProps {
  savingsValues: SavingsValues;
  onChangeTargetAmount: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function SavingsInputs({ savingsValues, onChangeTargetAmount }: SavingsInputsProps) {
  const { targetAmount } = savingsValues;
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
      <TextField label="월 납입액" placeholder="희망 월 납입액을 입력하세요" suffix="원" />
      <Spacing size={16} />
      <SelectBottomSheet label="저축 기간" title="저축 기간을 선택해주세요" value={12} onChange={() => {}}>
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
}
