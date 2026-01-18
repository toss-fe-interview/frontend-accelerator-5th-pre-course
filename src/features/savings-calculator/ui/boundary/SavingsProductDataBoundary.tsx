import { ErrorBoundary, Suspense } from '@suspensive/react';
import { SuspenseQuery } from '@suspensive/react-query';
import { ReactNode } from 'react';

import { savingsProductsQueryOptions } from 'entities/savings/model/savingsProductsQuery';
import { SavingsProduct } from 'entities/savings/model/types';

interface Props<TData> {
  select?: (data: SavingsProduct[]) => TData;
  children: (data: TData) => ReactNode;
}

export function SavingsProductDataBoundary<TData = SavingsProduct[]>({ select, children }: Props<TData>) {
  return (
    <ErrorBoundary fallback={({ error }) => <>{error.message}</>}>
      <Suspense fallback={'loading'}>
        <SuspenseQuery {...savingsProductsQueryOptions} select={select}>
          {({ data }) => children(data)}
        </SuspenseQuery>
      </Suspense>
    </ErrorBoundary>
  );
}
