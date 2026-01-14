import { Control, Controller } from 'react-hook-form';
import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { formatCurrency } from 'utils/format';
import { onlyNumbers } from 'utils/input';
import { SavingsFilterForm } from '../types/saving-filter-form';

interface Props {
  control: Control<SavingsFilterForm>;
}
export function SavingFilterForm({ control }: Props) {
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
            value={field.value ? formatCurrency(field.value) : ''}
            onChange={event => {
              const numbersOnly = onlyNumbers(event.target.value);
              field.onChange(Number(numbersOnly));
            }}
          />
        )}
      />
      <Spacing size={16} />

      <Controller
        name="monthlyPayment"
        control={control}
        render={({ field }) => (
          <TextField
            label="월 납입액"
            placeholder="희망 월 납입액을 입력하세요"
            suffix="원"
            value={field.value ? formatCurrency(field.value) : ''}
            onChange={event => {
              const numbersOnly = onlyNumbers(event.target.value);
              field.onChange(Number(numbersOnly));
            }}
          />
        )}
      />
      <Spacing size={16} />

      <Controller
        name="term"
        control={control}
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
}
