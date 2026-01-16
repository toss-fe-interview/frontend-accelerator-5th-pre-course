import SavingsProductList from 'domains/savingsCalculator/containers/SavingsProductList';

import { SavingsProductType } from 'shared/types/api/savings';

import { NavigationBar } from 'tosslib';
import SavingsInputs from 'domains/savingsCalculator/components/SavingsInputs';
import { formatCurrency, toNumber } from 'shared/utils/format';
import TabScreen from 'shared/components/layout/TabScreen';
import { useState } from 'react';
import CalculationResult from 'domains/savingsCalculator/containers/CalculationResult';

type Term = 6 | 12 | 24;

export function SavingsCalculatorPage() {
  /** refactor : useSavingsInputs 훅 제거하기
   * 1. 기존에 해당 훅은 무슨 역할이었을까? -> 목표금액, 월 납입액, 저축 기간의 상태를 관리하고 있었다.
   * 2. 훅으로 분리했을 때 얻을 수 있는 이점이 있는가? (코드가 짧아진다? -> 짧으면 왜 좋지? -> 짧은 게 가독성에 좋은건가? -> 한 번에 파악해야 하는 정보의 양이 줄어드는 장점)
   * 3. 훅으로 분리했을 때 가지는 단점은 무엇인가? (어떤 값이 있는지 모른다 + 각 값의 초기값과 타입을 명시적으로 알 수 없다)
   * => 정보의 양을 줄이는 것 vs 정보를 드러내는 것 => 정보를 드러내서 오히려 의도를 더 잘 나타낼 수 있다.
   * */
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [term, setTerm] = useState<Term>(12);

  const [selectedProduct, setSelectedProduct] = useState<SavingsProductType | null>(null);

  return (
    <TabScreen
      headers={<NavigationBar title="적금 계산기" />}
      topContents={
        <SavingsInputs
          targetAmountProps={{
            value: formatCurrency(targetAmount),
            onChange: e => setTargetAmount(toNumber(e.target.value)),
          }}
          monthlyPaymentProps={{
            value: formatCurrency(monthlyPayment),
            onChange: e => setMonthlyPayment(toNumber(e.target.value)),
          }}
          termProps={{ value: term, onChange: value => setTerm(value as Term) }}
        />
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
