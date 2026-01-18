import { ReactNode } from 'react';

interface SwitchCaseProps<T extends string> {
  value: T;
  caseBy: Record<T, ReactNode>;
  defaultComponent?: ReactNode;
}

export function SwitchCase<T extends string>({ value, caseBy, defaultComponent = null }: SwitchCaseProps<T>) {
  return <>{caseBy[value] ?? defaultComponent}</>;
}
