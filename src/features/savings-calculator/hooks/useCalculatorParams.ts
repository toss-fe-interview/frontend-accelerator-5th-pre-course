import { type inferParserType, parseAsInteger, useQueryStates } from 'nuqs';

const calculatorParamsParser = {
  targetAmount: parseAsInteger,
  monthlyAmount: parseAsInteger,
  savingTerms: parseAsInteger,
};

export type CalculatorParams = inferParserType<typeof calculatorParamsParser>;

export function useCalculatorParams() {
  const [params, setParams] = useQueryStates(calculatorParamsParser);

  return {
    targetAmount: params.targetAmount,
    monthlyAmount: params.monthlyAmount,
    savingTerms: params.savingTerms,
    setCalculatorParams: setParams,
  };
}
