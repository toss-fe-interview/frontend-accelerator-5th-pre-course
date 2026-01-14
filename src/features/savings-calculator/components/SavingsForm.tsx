import { SelectBottomSheet, Spacing } from 'tosslib';
import { NumberTextField } from 'shared/components';
import type { SavingsFormState } from 'shared/types';

interface SavingsFormProps {
  formState: SavingsFormState;
  onChange: (updates: Partial<SavingsFormState>) => void;
}

export function SavingsForm({ formState, onChange }: SavingsFormProps) {
  return (
    <>
      <NumberTextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={formState.goalAmount}
        onChange={value => onChange({ goalAmount: value })}
      />
      <Spacing size={16} />
      <NumberTextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={formState.monthlyAmount}
        onChange={value => onChange({ monthlyAmount: value })}
      />
      <Spacing size={16} />
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
