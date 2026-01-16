import { Border, NavigationBar, Spacing } from 'tosslib';
import { useState } from 'react';
import { Select } from 'shared/components/Select';
import { NumberInput } from 'shared/components/NumberInput';
import { SavingsProductTab } from 'features/savings/components/SavingsProductTab';

export function SavingsCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState<number | null>(null);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [terms, setTerms] = useState<number | null>(null);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

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
        onChange={value => setTerms(parseInt(value))}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <SavingsProductTab targetAmount={targetAmount} monthlyPayment={monthlyPayment} terms={terms} />
    </>
  );
}
