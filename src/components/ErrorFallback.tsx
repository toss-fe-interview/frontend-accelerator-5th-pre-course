import { ErrorBoundaryFallbackProps } from '@suspensive/react';

export default function ErrorFallback({ error, reset }: ErrorBoundaryFallbackProps) {
  return (
    <div>
      <p>문제가 발생했습니다.</p>
      <p>{error.message}</p>

      <button onClick={reset}>재시도</button>
    </div>
  );
}
