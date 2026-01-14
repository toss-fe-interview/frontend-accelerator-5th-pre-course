function MatchCase<T extends string>({
  matcher,
  cases,
}: {
  matcher: T;
  cases: Record<T, React.ReactNode | (() => React.ReactNode)>;
}): React.ReactNode {
  const caseFn = cases[matcher];

  if (typeof caseFn === 'function') {
    return caseFn();
  }

  return caseFn;
}

export default MatchCase;
