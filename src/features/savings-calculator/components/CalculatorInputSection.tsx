import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { formatNumber } from 'utils/format';
import { type CalculatorParams, useCalculatorParams } from '../hooks/useCalculatorParams';

type NumberInputKey = keyof Pick<CalculatorParams, 'targetAmount' | 'monthlyAmount'>;

export default function CalculatorInputSection() {
  const { targetAmount, monthlyAmount, savingTerms, setCalculatorParams } = useCalculatorParams();

  const handleNumberInputChange = (key: NumberInputKey, value: string) => {
    const next = parseNumber(value);
    setCalculatorParams({ [key]: next ?? null });
  };

  const handleSavingTermsChange = (value: number) => {
    setCalculatorParams({ savingTerms: value });
  };

  return (
    <div>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount ? formatNumber(targetAmount) : ''}
        onChange={e => handleNumberInputChange('targetAmount', e.target.value)}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyAmount ? formatNumber(monthlyAmount) : ''}
        onChange={e => handleNumberInputChange('monthlyAmount', e.target.value)}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingTerms ?? undefined}
        onChange={handleSavingTermsChange}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={18}>18개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </div>
  );
}

const isPositiveInteger = (value: number): boolean => Number.isInteger(value) && value > 0;

function parseNumber(value: string) {
  if (value === '') return;

  const numericValue = Number(value.replace(/\D/g, ''));
  if (isPositiveInteger(numericValue)) {
    return numericValue;
  }
}
