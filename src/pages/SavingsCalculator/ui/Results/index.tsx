interface ResultsProps<T> {
  data: T | null | undefined;
  fallback: React.ReactNode;
  children: React.ReactNode;
}

export const Results = <T,>({ data, fallback, children }: ResultsProps<T>) => {
  if (!data) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
