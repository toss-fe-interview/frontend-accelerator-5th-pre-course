import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { SAVING_PERIODS, SavingsFormData } from 'types/savings';
import { formatNumberWithComma } from 'utils/formatNumberWithComma';

interface SavingsFormProps {
  formData: SavingsFormData;
  onChangeInput: <K extends keyof SavingsFormData>(field: K, value: SavingsFormData[K]) => void;
}

export function SavingsForm({ formData, onChangeInput }: SavingsFormProps) {
  // 숫자 입력 처리 (콤마 포맷팅)
  const handleNumberInput = (field: 'targetAmount' | 'monthlyAmount', value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');
    // 콤마 포맷팅
    const formatted = numbers ? formatNumberWithComma(Number(numbers)) : '';
    onChangeInput(field, formatted);
  };

  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={formData.targetAmount}
        onChange={e => handleNumberInput('targetAmount', e.target.value)}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={formData.monthlyAmount}
        onChange={e => handleNumberInput('monthlyAmount', e.target.value)}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={formData.savingPeriod}
        onChange={value => onChangeInput('savingPeriod', value)}
      >
        {SAVING_PERIODS.map(period => (
          <SelectBottomSheet.Option key={period} value={period}>
            {period}개월
          </SelectBottomSheet.Option>
        ))}
      </SelectBottomSheet>
    </>
  );
}
