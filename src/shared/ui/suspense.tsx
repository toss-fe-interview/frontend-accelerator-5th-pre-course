import { ErrorBoundary } from '@suspensive/react';
import { Suspense, type JSX } from 'react';
import type { AwaitProps } from 'react-router';
import { Await } from 'react-router';

export const AsyncSuspense = <T,>({
  children,
  fallback = '로딩중',
  errorElement,
  resolve,
}: {
  children: AwaitProps<T>['children'];
  resolve?: T;
  errorElement?: AwaitProps<T>['errorElement'];
  fallback?: React.ReactNode;
}) => {
  return (
    <Suspense fallback={fallback}>
      {resolve ? (
        <Await resolve={resolve} errorElement={errorElement}>
          {children}
        </Await>
      ) : (
        <ErrorBoundary fallback={() => errorElement}>
          {typeof children === 'function' ? (children as () => JSX.Element)() : children}
        </ErrorBoundary>
      )}
    </Suspense>
  );
};
