import MoneyTextField from 'components/MoneyTextField';
import { useSavingsFilterStore } from 'stores/savingsFilterStore';
import { Spacing, SelectBottomSheet } from 'tosslib';

export const TERMS_SELECT_OPTION = [
  { value: 6, title: '6개월' },
  { value: 12, title: '12개월' },
  { value: 24, title: '24개월' },
] as const;

export type TermsValue = (typeof TERMS_SELECT_OPTION)[number]['value'];

export const SavingsFilter = () => {
  const { goal, changeGoal, monthlyPay, changeMonthlyPay, terms, changeTerms } = useSavingsFilterStore();

  return (
    <>
      <MoneyTextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        locale="ko-KR"
        value={goal}
        onValueChange={changeGoal}
      />
      <Spacing size={16} />
      <MoneyTextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        locale="ko-KR"
        value={monthlyPay}
        onValueChange={changeMonthlyPay}
      />
      <Spacing size={16} />
      <SelectBottomSheet label="저축 기간" title="저축 기간을 선택해주세요" value={terms} onChange={changeTerms}>
        {TERMS_SELECT_OPTION.map(opt => (
          <SelectBottomSheet.Option key={`terms-opt-${opt.value}`} value={opt.value}>
            {opt.title}
          </SelectBottomSheet.Option>
        ))}
      </SelectBottomSheet>
    </>
  );
};
