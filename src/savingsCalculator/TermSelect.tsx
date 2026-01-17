import { SelectBottomSheet } from 'tosslib';
import { Term } from 'savingsCalculator/types';

type Props = {
  label: string;
  value: Term;
  onChange: (value: Term) => void;
  prompt: string;
};

export default function TermSelect({ label, value, onChange, prompt }: Props) {
  return (
    <SelectBottomSheet<Term> label={label} title={prompt} value={value} onChange={onChange}>
      <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
    </SelectBottomSheet>
  );
}
