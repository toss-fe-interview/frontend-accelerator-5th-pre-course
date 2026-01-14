// src/components/SavingsForm.tsx
import { SelectBottomSheet, Spacing, TextField } from 'tosslib';

interface FormData {
  targetAmount: string;
  monthlyAmount: string;
  savingPeriod: number;
}

interface SavingsFormProps {
  formData: FormData;
  onChangeInput: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
}

export function SavingsForm({ formData, onChangeInput }: SavingsFormProps) {
  // 숫자 입력 처리 (콤마 포맷팅)
  const handleNumberInput = (field: 'targetAmount' | 'monthlyAmount', value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');
    // 콤마 포맷팅
    const formatted = numbers ? Number(numbers).toLocaleString('ko-KR') : '';
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
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
}
