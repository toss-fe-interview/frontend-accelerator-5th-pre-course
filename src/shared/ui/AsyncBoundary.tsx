import { ErrorBoundary, Suspense } from '@suspensive/react';
import { ReactNode } from 'react';
import { ListRow } from 'tosslib';

interface AsyncBoundaryProps {
  loadingMessage?: string;
  errorMessage?: string;
  children: ReactNode;
}

export const AsyncBoundary = ({ loadingMessage = 'loading...', errorMessage, children }: AsyncBoundaryProps) => {
  return (
    <ErrorBoundary
      fallback={({ error }) => (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top={errorMessage ?? error.message} />} />
      )}
    >
      <Suspense fallback={<ListRow contents={<ListRow.Texts type="1RowTypeA" top={loadingMessage} />} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};
