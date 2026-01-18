import { Suspense, ErrorBoundary } from '@suspensive/react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ComponentProps, FC, PropsWithChildren } from 'react';

interface AsyncBoundaryProps {
  pendingFallback: React.ReactNode;
  rejectedFallback: ComponentProps<typeof ErrorBoundary>['fallback'];
}

export const AsyncBoundary: FC<PropsWithChildren<AsyncBoundaryProps>> = ({
  pendingFallback,
  rejectedFallback,
  children,
}) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary fallback={rejectedFallback} onReset={reset}>
          <Suspense fallback={pendingFallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
