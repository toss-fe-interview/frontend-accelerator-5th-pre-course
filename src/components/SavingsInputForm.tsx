import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { formatNumber } from '../utils/format';

interface SavingsInputFormProps {
  targetAmount: number;
  monthlyAmount: number;
  savingTerm: number;
  onTargetAmountChange: (value: string) => void;
  onMonthlyAmountChange: (value: string) => void;
  onSavingTermChange: (value: number) => void;
}

export function SavingsInputForm({
  targetAmount,
  monthlyAmount,
  savingTerm,
  onTargetAmountChange,
  onMonthlyAmountChange,
  onSavingTermChange,
}: SavingsInputFormProps) {
  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount > 0 ? formatNumber(targetAmount) : ''}
        onChange={e => onTargetAmountChange(e.target.value)}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyAmount > 0 ? formatNumber(monthlyAmount) : ''}
        onChange={e => onMonthlyAmountChange(e.target.value)}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingTerm}
        onChange={onSavingTermChange}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
}