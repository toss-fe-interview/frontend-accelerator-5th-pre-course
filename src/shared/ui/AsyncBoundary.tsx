import { ErrorBoundary, Suspense } from '@suspensive/react';
import { ReactNode } from 'react';
import { ListRow } from 'tosslib';

interface AsyncBoundaryProps {
  loadingMessage: string;
  errorMessage: string;
  children: ReactNode;
}

function AsyncBoundary({ loadingMessage, errorMessage, children }: AsyncBoundaryProps) {
  return (
    <ErrorBoundary fallback={<ListRow contents={<ListRow.Texts type="1RowTypeA" top={errorMessage} />} />}>
      <Suspense fallback={<ListRow contents={<ListRow.Texts type="1RowTypeA" top={loadingMessage} />} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

export default AsyncBoundary;
