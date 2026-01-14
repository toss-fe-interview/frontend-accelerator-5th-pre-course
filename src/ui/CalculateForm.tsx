import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { SelectBottomSheet, Spacing, TextField } from 'tosslib';

const CalculateForm = ({
  state,
  action,
}: {
  state: { goalAmount: string; monthlyAmount: string; period: number };
  action: {
    handleAmountChange: (e: ChangeEvent<HTMLInputElement>, setState: Dispatch<SetStateAction<string>>) => void;
    setGoalAmount: Dispatch<SetStateAction<string>>;
    setMonthlyAmount: Dispatch<SetStateAction<string>>;
    setPeriod: Dispatch<SetStateAction<number>>;
  };
}) => {
  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={state.goalAmount}
        onChange={e => action.handleAmountChange(e, action.setGoalAmount)}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={state.monthlyAmount}
        onChange={e => action.handleAmountChange(e, action.setMonthlyAmount)}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={state.period}
        onChange={value => {
          action.setPeriod(value);
        }}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
};
export default CalculateForm;
