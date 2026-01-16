import { NumberInput } from 'shared/components/NumberInput';
import { Spacing } from 'tosslib';

type AmountInputSectionProps = {
  targetAmount: number;
  monthlyPayment: number;
  setTargetAmount: (value: number) => void;
  setMonthlyPayment: (value: number) => void;
};

export const AmountInputSection = ({
  targetAmount,
  monthlyPayment,
  setTargetAmount,
  setMonthlyPayment,
}: AmountInputSectionProps) => {
  return (
    <>
      <NumberInput
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount}
        onChange={setTargetAmount}
      />
      <Spacing size={16} />
      <NumberInput
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyPayment}
        onChange={setMonthlyPayment}
      />
    </>
  );
};
