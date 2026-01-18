import { SelectBottomSheet } from 'tosslib';
import { Term } from 'savingsCalculator/types';

type Props = {
  label: string;
  value: Term;
  onChange: (value: Term) => void;
  prompt: string;
  options: Array<{ value: Term; label: string }>;
};

export default function TermSelect({ label, value, onChange, prompt, options }: Props) {
  return (
    <SelectBottomSheet<Term> label={label} title={prompt} value={value} onChange={onChange}>
      {options.map(option => (
        <SelectBottomSheet.Option key={option.value} value={option.value}>
          {option.label}
        </SelectBottomSheet.Option>
      ))}
    </SelectBottomSheet>
  );
}
