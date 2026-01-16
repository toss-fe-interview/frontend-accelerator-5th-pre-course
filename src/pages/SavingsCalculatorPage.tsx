import { useState } from 'react';
import { NavigationBar, Spacing, Border, TextField, SelectBottomSheet } from 'tosslib';

export function SavingsCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState(0);
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [savingTerms, setSavingTerms] = useState(12);
  // const [selectedSavingProduct, setSelectedSavingProduct] = useState<SavingsProduct | null>(null);

  // const expectedProfit = calculateExpectedProfit(monthlyAmount, savingTerms, selectedSavingProduct?.annualRate ?? 0);
  // const diffAmount = Number(targetAmount ?? 0) - expectedProfit;
  // const recommendMonthlyPayment = calculateRecommendMonthlyPayment(
  //   targetAmount,
  //   savingTerms,
  //   selectedSavingProduct?.annualRate ?? 0
  // );

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <>
        <TextField
          label="목표 금액"
          placeholder="목표 금액을 입력하세요"
          suffix="원"
          value={targetAmount.toLocaleString('ko-KR')}
          onChange={e => {
            const num = Number(e.target.value);
            setTargetAmount(num);
          }}
        />
        <Spacing size={16} />
        <TextField
          label="월 납입액"
          placeholder="희망 월 납입액을 입력하세요"
          suffix="원"
          value={monthlyAmount.toLocaleString('ko-KR')}
          onChange={e => {
            const num = Number(e.target.value);
            setMonthlyAmount(num);
          }}
        />
        <Spacing size={16} />
        <SelectBottomSheet
          label="저축 기간"
          title="저축 기간을 선택해주세요"
          value={savingTerms}
          onChange={setSavingTerms}
        >
          <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
          <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
          <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
        </SelectBottomSheet>
      </>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      {/* <ProductTabs
        targetAmount={targetAmount}
        monthlyAmount={monthlyAmount}
        savingTerms={savingTerms}
        selectedProduct={selectedSavingProduct}
        onProductSelect={setSelectedSavingProduct}
        expectedProfit={expectedProfit}
        diffAmount={diffAmount}
        recommendMonthlyPayment={recommendMonthlyPayment}
      /> */}
    </>
  );
}
