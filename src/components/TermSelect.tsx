import { SelectBottomSheet } from 'tosslib';

export function TermSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  options: Array<{ label: string; value: number }>;
}) {
  return (
    <SelectBottomSheet
      label={label}
      title="저축 기간을 선택해주세요"
      value={numberToString(value)}
      onChange={value => onChange(stringToNumber(value))}
    >
      {options.map(option => (
        <SelectBottomSheet.Option key={option.value} value={numberToString(option.value)}>
          {option.label}
        </SelectBottomSheet.Option>
      ))}
    </SelectBottomSheet>
  );
}

export function numberToString(value: number | null): string | null {
  return value !== null ? String(value) : null;
}

export function stringToNumber(value: string | null): number | null {
  return value !== null ? Number(value) : null;
}
