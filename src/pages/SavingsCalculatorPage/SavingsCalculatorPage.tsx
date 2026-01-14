import { ListRow, NavigationBar, Spacing } from 'tosslib';
import { useForm } from 'react-hook-form';
import { SavingsCalculatorContents } from './components/SavingsCalculatorContents';
import { SavingsFilterForm } from './types/saving-filter-form';
import { SavingFilterForm } from './components/SavingFilterForm';
import { AsyncBoundary } from 'components/AsyncBoundary';
import { SavingProductErrorFallback } from './components/fallback/SavingProductErrorFallback';

export function SavingsCalculatorPage() {
  const form = useForm<SavingsFilterForm>({
    defaultValues: {
      targetAmount: null,
      monthlyPayment: null,
      term: 12,
    },
  });

  const [targetAmount, monthlyPayment, term] = form.watch(['targetAmount', 'monthlyPayment', 'term']);

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <SavingFilterForm control={form.control} />
      <Spacing size={24} />

      <AsyncBoundary
        pendingFallback={<ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품 정보를 불러오는 중..." />} />}
        rejectedFallback={SavingProductErrorFallback}
      >
        <SavingsCalculatorContents targetAmount={targetAmount} monthlyPayment={monthlyPayment} term={term} />
      </AsyncBoundary>
      <Spacing size={40} />
    </>
  );
}
