import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { SavingsInput } from '../../types/types';
import { formatCurrency } from '../../lib/formatCurrency';
import { extractNumbers } from '../../lib/extractNumbers';

export function SavingsInputForm({
  savingsInput,
  handleSavingsInputChange,
}: {
  savingsInput: SavingsInput;
  handleSavingsInputChange: (key: keyof SavingsInput, value: string | number) => void;
}) {
  const { targetAmount, monthlyAmount, savingsTerm } = savingsInput;

  const handleFormatCurrency = (value: string) => {
    return formatCurrency(Number(extractNumbers(value)));
  };

  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount && handleFormatCurrency(targetAmount)}
        onChange={e => handleSavingsInputChange('targetAmount', extractNumbers(e.target.value))}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyAmount && handleFormatCurrency(monthlyAmount)}
        onChange={e => handleSavingsInputChange('monthlyAmount', extractNumbers(e.target.value))}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsTerm}
        onChange={value => handleSavingsInputChange('savingsTerm', Number(value))}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
}
