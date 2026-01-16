import SavingsProductList from 'domains/savingsCalculator/containers/SavingsProductList';

import { SavingsProductType } from 'shared/types/api/savings';

import { NavigationBar, Spacing } from 'tosslib';
import TabScreen from 'shared/components/layout/TabScreen';
import { useState } from 'react';
import CalculationResult from 'domains/savingsCalculator/containers/CalculationResult';
import TargetAmountField from 'domains/savingsCalculator/components/form/TargetAmountField';
import MonthlyAmountField from 'domains/savingsCalculator/components/form/MonthlyAmountField';
import TermField from 'domains/savingsCalculator/components/form/TermField';

export function SavingsCalculatorPage() {
  /** refactor : useSavingsInputs 훅 제거하기
   * 1. 기존에 해당 훅은 무슨 역할이었을까? -> 목표금액, 월 납입액, 저축 기간의 상태를 관리하고 있었다.
   * 2. 훅으로 분리했을 때 얻을 수 있는 이점이 있는가? (코드가 짧아진다? -> 짧으면 왜 좋지? -> 짧은 게 가독성에 좋은건가? -> 한 번에 파악해야 하는 정보의 양이 줄어드는 장점)
   * 3. 훅으로 분리했을 때 가지는 단점은 무엇인가? (어떤 값이 있는지 모른다 + 각 값의 초기값과 타입을 명시적으로 알 수 없다)
   * => 정보의 양을 줄이는 것 vs 정보를 드러내는 것 => 정보를 드러내서 오히려 의도를 더 잘 나타낼 수 있다.
   * */
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [term, setTerm] = useState<6 | 12 | 24>(12);

  const [selectedProduct, setSelectedProduct] = useState<SavingsProductType | null>(null);

  return (
    <TabScreen
      headers={<NavigationBar title="적금 계산기" />}
      topContents={
        <>
          {/* 본질이 뭐지? 값을 "보여주기" + 값을 "변경하기" + "어떤 필드"인지 보여주기 */}
          {/* 값을 보여줄 때, 이게 TextField인지, SelectBottomSheet 인지 알 필요가 있을까? => 이건 how 라고 생각된다 */}
          {/* 이런 경우 본질을 더 잘 드러내기 위해 분리하면 어떨까? */}
          <TargetAmountField label="목표 금액" value={targetAmount} onChange={value => setTargetAmount(value)} />
          <Spacing size={16} />
          <MonthlyAmountField label="월 납입액" value={monthlyPayment} onChange={value => setMonthlyPayment(value)} />
          <Spacing size={16} />
          <TermField label="저축 기간" value={term} onChange={value => setTerm(value)} />
        </>
      }
      bottomTabs={[
        {
          value: 'products',
          label: '적금 상품',
          contents: (
            <SavingsProductList
              term={term}
              monthlyPayment={monthlyPayment}
              onSelect={product => setSelectedProduct(product)}
              selectedId={selectedProduct?.id}
            />
          ),
        },
        {
          value: 'results',
          label: '계산 결과',
          contents: (
            <CalculationResult
              userInputs={{
                targetAmount,
                monthlyPayment,
                term,
              }}
              selectedProduct={selectedProduct}
            />
          ),
        },
      ]}
    />
  );
}
