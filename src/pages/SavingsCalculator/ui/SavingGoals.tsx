import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { useSavingForm } from '../hooks/useSavingForm';
import { createAmountHandler } from '../utils';

export const SavingGoals = ({ values, handlers }: ReturnType<typeof useSavingForm>) => {
  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={values.목표금액}
        onChange={createAmountHandler(handlers.set목표금액)}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={values.월납입액}
        onChange={createAmountHandler(handlers.set월납입액)}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={values.저축기간}
        onChange={handlers.set저축기간}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
};
