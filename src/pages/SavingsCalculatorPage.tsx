import { RecommendedProductHeader } from 'components/Savings/Result/RecommendedProductHeader';
import { Savings, useSavingsCalculator } from '../components/Savings';

export type SavingsTabValue = 'products' | 'results';

export type SavingTabListType = {
  value: SavingsTabValue;
  name: string;
}[];

export function SavingsCalculatorPage() {
  const { setGoalAmount, setMonthlyDeposit, setSavingsPeriod, state } = useSavingsCalculator();

  const tabs: SavingTabListType = [
    { value: 'products', name: '적금 상품' },
    { value: 'results', name: '계산 결과' },
  ];

  return (
    <Savings calculatorState={state}>
      <Savings.NavigationBar title="적금 계산기" />
      {/* TODO :Calculator에서 상태관리하고, context에서 필터링만 진행. */}
      <Savings.Calculator>
        <Savings.Calculator.GoalAmountInput onChange={setGoalAmount} />
        <Savings.Calculator.MonthlyDepositInput onChange={setMonthlyDeposit} />
        <Savings.Calculator.PeriodSelector onChange={setSavingsPeriod} value={state.savingsPeriod} />
      </Savings.Calculator>

      <Savings.Divider />
      <Savings.TabNavigation tabs={tabs} />
      <Savings.TabContent
        renderProps={(tab) => (
          <>
            {tab === 'products' && <Savings.ProductList/>}
            {tab === 'results' && <>
            <Savings.Result />
            <RecommendedProductHeader />
            </>}
          </>
        )}
      />
    </Savings>
  );
}
