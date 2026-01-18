import { SavingsCalculatorTerm } from 'pages/SavingsCalculatorPage/types/saving-filter-form';
import { ComponentProps } from 'react';
import { SelectBottomSheet } from 'tosslib';

type SelectBottomSheetProps = ComponentProps<typeof SelectBottomSheet>;

interface Props extends Omit<SelectBottomSheetProps, 'value' | 'onChange' | 'children'> {
  options: Array<{ value: SavingsCalculatorTerm; label: string }>;
  value: SavingsCalculatorTerm;
  onSelect: (value: SavingsCalculatorTerm) => void;
}

export function SelectTermField({ options, value, onSelect, ...props }: Props) {
  return (
    <SelectBottomSheet {...props} value={value} onChange={onSelect}>
      {options.map(option => (
        <SelectBottomSheet.Option key={option.value} value={option.value}>
          {option.label}
        </SelectBottomSheet.Option>
      ))}
    </SelectBottomSheet>
  );
}
