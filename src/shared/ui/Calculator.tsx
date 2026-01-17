interface CalculatorProps<T> {
  formula: () => T;
  children: (result: T) => React.ReactNode;
}

export const Calculator = <T,>({ formula, children }: CalculatorProps<T>) => {
  const result = formula();
  return <>{children(result)}</>;
};
