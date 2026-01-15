import { TextField, SelectBottomSheet, Spacing } from 'tosslib';
import { CHECK_AMOUNT_REGEX } from '../../constants/regex';
import { formatKRAmount } from '../../utils/format';

type CalculatorFieldsProps = {
  targetAmount: string;
  monthlyAmount: string;
  savingTerms: number;
  onTargetAmountChange: (value: string) => void;
  onMonthlyAmountChange: (value: string) => void;
  onSavingTermsChange: (value: number) => void;
};

export function CalculatorFields({
  targetAmount,
  monthlyAmount,
  savingTerms,
  onTargetAmountChange,
  onMonthlyAmountChange,
  onSavingTermsChange,
}: CalculatorFieldsProps) {
  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={formatKRAmount(Number(targetAmount))}
        onChange={e => {
          const value = e.target.value.slice(0, 13);
          const result = value.replace(/,/g, '');
          if (CHECK_AMOUNT_REGEX.test(result)) {
            onTargetAmountChange(result ?? '');
          }
        }}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={formatKRAmount(Number(monthlyAmount))}
        onChange={e => {
          const value = e.target.value.slice(0, 13);
          const result = value.replace(/,/g, '');
          if (CHECK_AMOUNT_REGEX.test(result)) {
            onMonthlyAmountChange(result);
          }
        }}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingTerms}
        onChange={onSavingTermsChange}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
}
