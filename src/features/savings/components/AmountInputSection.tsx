import { Spacing, TextField } from 'tosslib';

type AmountInputSectionProps = {
  targetAmount: number | null;
  monthlyPayment: number | null;
  setTargetAmount: (value: number | null) => void;
  setMonthlyPayment: (value: number | null) => void;
};

export const AmountInputSection = ({
  targetAmount,
  monthlyPayment,
  setTargetAmount,
  setMonthlyPayment,
}: AmountInputSectionProps) => {
  const handleTargetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setTargetAmount(numericValue === '' ? null : parseInt(numericValue));
  };

  const handleMonthlyPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setMonthlyPayment(numericValue === '' ? null : parseInt(numericValue));
  };

  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount === null ? '' : String(targetAmount)}
        onChange={handleTargetAmountChange}
      />
      <Spacing size={16} />

      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyPayment === null ? '' : String(monthlyPayment)}
        onChange={handleMonthlyPaymentChange}
      />
    </>
  );
};
