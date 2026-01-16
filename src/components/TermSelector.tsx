import { SelectBottomSheet } from 'tosslib';

interface TermSelectorProps {
  label: string;
  title: string;
  value?: number;
  onSelect: (term: number) => void;
}

const TermSelector = ({ label, title, onSelect, value }: TermSelectorProps) => {
  return (
    <SelectBottomSheet label={label} title={title} value={value == null ? undefined : value} onChange={onSelect}>
      <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
    </SelectBottomSheet>
  );
};

export { TermSelector };
