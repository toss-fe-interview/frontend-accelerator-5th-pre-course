import { Control, Controller, useForm, useWatch } from 'react-hook-form';
import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { formatPrice, parsePrice } from 'shared/lib/format';
import { isNotNull } from 'shared/lib/compare';

export interface SavingsGoalFormData {
  targetAmount: number | null;
  monthlyAmount: number | null;
  term: number;
}

const DEFAULT_VALUES: SavingsGoalFormData = {
  targetAmount: null,
  monthlyAmount: null,
  term: 12,
};

const TERM_OPTIONS = [
  { value: 6, label: '6개월' },
  { value: 12, label: '12개월' },
  { value: 24, label: '24개월' },
] as const;

export const useSavingsGoalForm = (defaultValues?: Partial<SavingsGoalFormData>) => {
  const { control } = useForm<SavingsGoalFormData>({
    defaultValues: {
      ...DEFAULT_VALUES,
      ...defaultValues,
    },
    mode: 'onChange',
  });

  const formData = useWatch({ control }) as SavingsGoalFormData;

  return { control, formData };
};

interface SavingsGoalFormProps {
  control: Control<SavingsGoalFormData>;
}

const SavingsGoalForm = ({ control }: SavingsGoalFormProps) => {
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
            value={isNotNull(field.value) ? formatPrice(field.value) : ''}
            onChange={e => field.onChange(parsePrice(e.target.value))}
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
            value={isNotNull(field.value) ? formatPrice(field.value) : ''}
            onChange={e => field.onChange(parsePrice(e.target.value))}
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
            {TERM_OPTIONS.map(option => (
              <SelectBottomSheet.Option key={option.value} value={option.value}>
                {option.label}
              </SelectBottomSheet.Option>
            ))}
          </SelectBottomSheet>
        )}
      />
    </>
  );
};

export default SavingsGoalForm;
