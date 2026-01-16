import { Spacing, TextField } from 'tosslib';

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
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={String(targetAmount)}
        onChange={e => setTargetAmount(Number(e.target.value))}
      />
      <Spacing size={16} />

      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={String(monthlyPayment)}
        onChange={e => setMonthlyPayment(Number(e.target.value))}
      />
    </>
  );
};
