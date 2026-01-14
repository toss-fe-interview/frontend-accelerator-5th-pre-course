import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { CalculInputs } from '../SavingsCalculatorPage';

interface SavingCalculatorInputProps {
  calculInputs: CalculInputs;
  onChange: (value: CalculInputs) => void;
}

export default function SavingCalculatorInput({ calculInputs, onChange }: SavingCalculatorInputProps) {
  const handleTargetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    const numValue = value === '' ? 0 : Number(value);
    if (!isNaN(numValue)) {
      onChange({ ...calculInputs, targetAmount: numValue });
    }
  };

  const handleMonthlyAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    const numValue = value === '' ? 0 : Number(value);
    if (!isNaN(numValue)) {
      onChange({ ...calculInputs, monthlyAmount: numValue });
    }
  };

  const handleTermChange = (value: number) => {
    onChange({ ...calculInputs, term: value });
  };

  return (
    <>
      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={calculInputs.targetAmount.toLocaleString('ko-KR')}
        onChange={handleTargetAmountChange}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={calculInputs.monthlyAmount.toLocaleString('ko-KR')}
        onChange={handleMonthlyAmountChange}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={calculInputs.term}
        onChange={handleTermChange}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
      <Spacing size={24} />
    </>
  );
}
