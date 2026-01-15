type PropsType<Case extends string> = {
  value: Case;
  caseBy: Partial<Record<Case, React.ReactNode | null>>;
  defaultComponents?: React.ReactNode | null;
};

export const SwitchCase = <Case extends string>({ value, caseBy, defaultComponents = null }: PropsType<Case>) => {
  if (value === null) {
    return defaultComponents;
  }

  return caseBy[value] ?? defaultComponents;
};
