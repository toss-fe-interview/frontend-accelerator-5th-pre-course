import { FormSchema } from 'domain/savings/schema/form';
import { UseFormReturn } from 'react-hook-form';
import { SelectBottomSheet, Spacing, TextField } from 'tosslib';

interface Props {
  filterForm: UseFormReturn<FormSchema>;
}

export const SavingsFilter = ({ filterForm }: Props) => {
  const goalAmount = filterForm.watch('goalAmount');
  const monthlyAmount = filterForm.watch('monthlyAmount');
  const terms = filterForm.watch('terms');

  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={goalAmount ? goalAmount.toString() : ''}
        onChange={e => filterForm.setValue('goalAmount', e.target.value ? Number(e.target.value) : undefined)}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyAmount ? monthlyAmount.toString() : ''}
        onChange={e => filterForm.setValue('monthlyAmount', e.target.value ? Number(e.target.value) : undefined)}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={terms}
        onChange={value => filterForm.setValue('terms', value)}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
};
