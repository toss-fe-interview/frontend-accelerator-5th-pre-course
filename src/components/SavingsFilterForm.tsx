import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { SAVINGS_FILTER_FORM, useSavingsFilterForm } from 'hooks/useSavingsFilterForm';

type SavingsFilterFormProps = ReturnType<typeof useSavingsFilterForm>;

export const SavingsFilterForm = (props: SavingsFilterFormProps) => {
  const { savingsFilterForm, handleChanges } = props;
  const { goalAmount, monthlySaving, savingPeriod } = savingsFilterForm;

  return (
    <>
      <TextField
        value={goalAmount}
        onChange={handleChanges[SAVINGS_FILTER_FORM.GOAL_AMOUNT]}
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
      />
      <Spacing size={16} />
      <TextField
        value={monthlySaving}
        onChange={handleChanges[SAVINGS_FILTER_FORM.MONTHLY_SAVING]}
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
      />
      <Spacing size={16} />
      <SelectBottomSheet
        value={savingPeriod}
        onChange={handleChanges[SAVINGS_FILTER_FORM.SAVING_PERIOD]}
        label="저축 기간"
        title="저축 기간을 선택해주세요"
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
};
