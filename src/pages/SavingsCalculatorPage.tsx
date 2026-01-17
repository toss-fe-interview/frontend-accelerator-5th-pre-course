import SavingCalculator from 'components/SavingCalculator';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { NavigationBar, Spacing, Button, Text } from 'tosslib';
import { isCriticalError, isRetryableError } from 'utils/error';

export function SavingsCalculatorPage() {
  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
        )}
        onError={errorHandler}
      >
        <Suspense fallback={<></>}>
          <SavingCalculator />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

function ErrorFallback({ error, resetErrorBoundary }: { error: unknown; resetErrorBoundary: () => void }) {
  const retryable = isRetryableError(error);

  return (
    <div style={{ padding: 16, textAlign: 'center' }}>
      <Text>{retryable ? '일시적인 문제가 발생했어요' : '계산기를 불러올 수 없어요..🫥'}</Text>
      <Spacing size={12} />
      {retryable ? (
        <Button onClick={resetErrorBoundary}>다시 시도</Button>
      ) : (
        <Button onClick={() => window.location.reload()}>새로고침</Button>
      )}
    </div>
  );
}

function errorHandler(error: unknown) {
  // 1. retryable 에러는 이 페이지에서 처리 (ErrorFallback에서 "다시 시도" 표시)
  // 에러가 발생해도, 재시도 버튼을 눌러봤자 해결되지 않는건 따로 처리해야함.
  if (isRetryableError(error)) {
    console.warn('[SavingsCalculator] Retryable error:', error);
    return;
  }

  // 2. 앱 전체에 영향을 주는 치명적 에러는 상위로 던짐 (인증/권한 에러, 서버 에러)
  if (isCriticalError(error)) {
    throw error;
  }

  // 3. 그 외 에러는 로깅만 처리하자~
  console.error('[SavingsCalculator]', error);
}
