import { ChangeEvent } from 'react';
import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import type { SavingsFormState } from 'shared/types';

interface SavingsFormProps {
  formState: SavingsFormState;
  onChange: (updates: Partial<SavingsFormState>) => void;
}

export function SavingsForm({ formState, onChange }: SavingsFormProps) {
  // 숫자 포맷팅 함수 (formatNumber 인라인)
  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR');
  };

  // 목표 금액 핸들러
  const handleGoalAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericString = inputValue.replace(/,/g, '').replace(/[^0-9]/g, '');

    if (numericString === '') {
      onChange({ goalAmount: null });
      return;
    }

    const numericValue = parseInt(numericString, 10);
    onChange({ goalAmount: numericValue });
  };

  // 월 납입액 핸들러
  const handleMonthlyAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericString = inputValue.replace(/,/g, '').replace(/[^0-9]/g, '');

    if (numericString === '') {
      onChange({ monthlyAmount: null });
      return;
    }

    const numericValue = parseInt(numericString, 10);
    onChange({ monthlyAmount: numericValue });
  };

  // 표시할 값 계산
  const goalAmountDisplay = formState.goalAmount !== null ? formatNumber(formState.goalAmount) : '';
  const monthlyAmountDisplay = formState.monthlyAmount !== null ? formatNumber(formState.monthlyAmount) : '';

  return (
    <>
      {/* 목표 금액 입력 */}
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={goalAmountDisplay}
        onChange={handleGoalAmountChange}
      />

      <Spacing size={16} />

      {/* 월 납입액 입력 */}
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyAmountDisplay}
        onChange={handleMonthlyAmountChange}
      />

      <Spacing size={16} />

      {/* 저축 기간 선택 */}
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={formState.term}
        onChange={value => onChange({ term: value })}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
}
