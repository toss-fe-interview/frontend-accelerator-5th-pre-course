import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Component, ErrorInfo, ReactNode, Suspense } from 'react';

type RenderFallbackProps = {
  error: Error;
  reset: () => void;
};

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode | ((props: RenderFallbackProps) => ReactNode);
  onReset?: () => void;
};

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  reset = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      if (typeof fallback === 'function') {
        return fallback({ error, reset: this.reset });
      }
      return fallback;
    }

    return children;
  }
}

type SuspenseBoundaryProps = {
  children: ReactNode;
  pendingFallback: ReactNode;
  rejectedFallback: ReactNode | ((props: RenderFallbackProps) => ReactNode);
};

export const SuspenseBoundary = ({ children, pendingFallback, rejectedFallback }: SuspenseBoundaryProps) => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary fallback={rejectedFallback} onReset={reset}>
      <Suspense fallback={pendingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};
