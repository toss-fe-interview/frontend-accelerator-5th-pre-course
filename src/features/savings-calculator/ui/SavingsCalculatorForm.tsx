import { SavingsCalculatorFormData } from 'features/savings-calculator/model/useSavingsCalculatorForm';
import { Control, Controller } from 'react-hook-form';
import { SelectBottomSheet, Spacing, TextField } from 'tosslib';

type SavingsCalculatorFormProps = {
  control: Control<SavingsCalculatorFormData>;
};

export function SavingsCalculatorForm({ control }: SavingsCalculatorFormProps) {
  return (
    <>
      <Controller
        name="targetAmount"
        control={control}
        render={({ field }) => (
          <TextField
            label="목표 금액"
            placeholder="목표 금액을 입력하세요"
            suffix="원"
            value={field.value ? field.value.toString() : ''}
            onChange={event => field.onChange(Number(event.target.value))}
          />
        )}
      />

      <Spacing size={16} />
      <Controller
        name="monthlyAmount"
        control={control}
        render={({ field }) => (
          <TextField
            label="월 납입액"
            placeholder="희망 월 납입액을 입력하세요"
            suffix="원"
            value={field.value?.toString()}
            onChange={event => field.onChange(Number(event.target.value))}
          />
        )}
      />
      <Spacing size={16} />
      <Controller
        name="availableTerms"
        control={control}
        render={({ field }) => (
          <SelectBottomSheet
            label="저축 기간"
            title="저축 기간을 선택해주세요"
            value={field.value}
            onChange={value => field.onChange(value)}
          >
            <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
            <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
            <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
          </SelectBottomSheet>
        )}
      />
    </>
  );
}
