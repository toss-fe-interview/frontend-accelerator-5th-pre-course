import { SuspenseQuery } from '@suspensive/react-query';
import { queries } from 'shared/api/queries';
import { AsyncSuspense } from 'shared/ui/suspense';
import { SavingsCalculator } from './SavingsCalculator';

export function SavingsCalculatorPage() {
  return (
    <AsyncSuspense>
      <SuspenseQuery {...queries.savingsProducts()}>
        {({ data }) => <SavingsCalculator savingProducts={data} />}
      </SuspenseQuery>
    </AsyncSuspense>
  );
}
