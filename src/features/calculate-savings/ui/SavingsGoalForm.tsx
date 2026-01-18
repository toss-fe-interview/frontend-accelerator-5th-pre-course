import { Controller, useForm } from 'react-hook-form';
import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { useEffect } from 'react';
import { formatNumber } from 'shared/lib/format';

interface SavingsGoalFormData {
  targetAmount: number;
  monthlyAmount: number;
  term: number;
}

interface SavingsGoalFormChangeHandler {
  (data: SavingsGoalFormData): void;
}

const DEFAULT_VALUES: SavingsGoalFormData = {
  targetAmount: 0,
  monthlyAmount: 0,
  term: 12,
};

interface SavingsGoalFormProps {
  defaultValues?: Partial<SavingsGoalFormData>;
  onChange?: SavingsGoalFormChangeHandler;
}

const SavingsGoalForm = ({ defaultValues, onChange }: SavingsGoalFormProps) => {
  const { control, watch } = useForm<SavingsGoalFormData>({
    defaultValues: {
      ...DEFAULT_VALUES,
      ...defaultValues,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const subscription = watch(data => onChange?.(data as SavingsGoalFormData));
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <>
      <Controller
        control={control}
        name="targetAmount"
        render={({ field }) => (
          <TextField
            label="목표 금액"
            placeholder="목표 금액을 입력하세요"
            suffix="원"
            value={field.value > 0 ? formatNumber(field.value) : ''}
            onChange={e => {
              const value = e.target.value.replace(/,/g, '');
              const numberValue = parseInt(value, 10);
              field.onChange(isNaN(numberValue) ? 0 : numberValue);
            }}
          />
        )}
      />

      <Spacing size={16} />
      <Controller
        control={control}
        name="monthlyAmount"
        render={({ field }) => (
          <TextField
            label="월 납입액"
            placeholder="희망 월 납입액을 입력하세요"
            suffix="원"
            value={field.value > 0 ? formatNumber(field.value) : ''}
            onChange={e => {
              const value = e.target.value.replace(/,/g, '');
              const numberValue = parseInt(value, 10);
              field.onChange(isNaN(numberValue) ? 0 : numberValue);
            }}
          />
        )}
      />
      <Spacing size={16} />
      <Controller
        control={control}
        name="term"
        render={({ field }) => (
          <SelectBottomSheet
            label="저축 기간"
            title="저축 기간을 선택해주세요"
            value={field.value}
            onChange={field.onChange}
          >
            <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
            <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
            <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
          </SelectBottomSheet>
        )}
      />
    </>
  );
};

export default SavingsGoalForm;
