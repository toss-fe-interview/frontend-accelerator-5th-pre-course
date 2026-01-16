import CalculationResultItem from './CalculationResultItem';

type CalculationResultsProps = {
  results: Array<{ label: string; value: string }>;
};

const CalculationResults = ({ results }: CalculationResultsProps) => {
  return results.map(result => <CalculationResultItem key={result.label} label={result.label} value={result.value} />);
};

export default CalculationResults;
