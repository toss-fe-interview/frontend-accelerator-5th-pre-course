import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TextField, Spacing, SelectBottomSheet } from 'tosslib';
import { formatNumber, parseNumberInput } from 'utils/format';
import { SavingsFormInput } from 'types/savings';

interface SavingsTargetFormProps {
  onChange?: (data: SavingsFormInput) => void;
}

const SavingsTargetForm = ({ onChange }: SavingsTargetFormProps) => {
  const { control, watch } = useForm<SavingsFormInput>({
    defaultValues: {
      targetAmount: 0,
      monthlyAmount: 0,
      terms: 12,
    },
    mode: 'onChange',
  });

  const targetAmount = watch('targetAmount');
  const monthlyAmount = watch('monthlyAmount');
  const terms = watch('terms');

  useEffect(() => {
    onChange?.({ targetAmount, monthlyAmount, terms });
  }, [targetAmount, monthlyAmount, terms, onChange]);

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
            onChange={e => field.onChange(parseNumberInput(e.target.value))}
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
            onChange={e => field.onChange(parseNumberInput(e.target.value))}
          />
        )}
      />
      <Spacing size={16} />
      <Controller
        control={control}
        name="terms"
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

export default SavingsTargetForm;
