import { Spacing } from 'tosslib';
import { NumberInput } from 'shared/components/NumberInput';
import { Select } from 'shared/components/Select';

type SavingsProductFilterFormProps = {
  targetAmount: number | null;
  onTargetAmountChange: (value: number | null) => void;
  monthlyPayment: number | null;
  onMonthlyPaymentChange: (value: number | null) => void;
  terms: number | null;
  onTermsChange: (value: number | null) => void;
};

export function SavingsProductFilterForm({
  targetAmount,
  onTargetAmountChange,
  monthlyPayment,
  onMonthlyPaymentChange,
  terms,
  onTermsChange,
}: SavingsProductFilterFormProps) {
  return (
    <>
      <NumberInput
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount}
        onChange={onTargetAmountChange}
      />
      <Spacing size={16} />
      <NumberInput
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyPayment}
        onChange={onMonthlyPaymentChange}
      />
      <Spacing size={16} />
      <Select
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={terms?.toString() ?? ''}
        options={[
          { value: '6', label: '6개월' },
          { value: '12', label: '12개월' },
          { value: '24', label: '24개월' },
        ]}
        onChange={value => onTermsChange(parseInt(value))}
      />
    </>
  );
}
