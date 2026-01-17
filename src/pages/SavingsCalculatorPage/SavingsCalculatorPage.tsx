import { Border, NavigationBar, SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { useState } from 'react';

import { formatCurrency } from './lib/formatCurrency';
import { extractNumbers } from './lib/extractNumbers';
import { SavingsResultTabs } from './components/SavingsResultTabs';

export function SavingsCalculatorPage() {
  const [savingsInput, setSavingsInput] = useState({
    targetAmount: '',
    monthlyAmount: '',
    savingsTerm: 12,
  });

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={savingsInput.targetAmount && formatCurrency(Number(savingsInput.targetAmount))}
        onChange={e => setSavingsInput({ ...savingsInput, targetAmount: extractNumbers(e.target.value) })}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={savingsInput.monthlyAmount && formatCurrency(Number(savingsInput.monthlyAmount))}
        onChange={e => setSavingsInput({ ...savingsInput, monthlyAmount: extractNumbers(e.target.value) })}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsInput.savingsTerm}
        onChange={value => setSavingsInput({ ...savingsInput, savingsTerm: Number(value) })}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <SavingsResultTabs savingsInput={savingsInput} />
    </>
  );
}
