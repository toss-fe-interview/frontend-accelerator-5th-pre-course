import { SelectBottomSheet, TextField } from 'tosslib';
import { formatNumber } from 'utils/format';

export function TargetAmountInput({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  return (
    <TextField
      label="목표 금액"
      placeholder="목표 금액을 입력하세요"
      suffix="원"
      value={value ? formatNumber(value) : ''}
      onChange={e => onChange(parseNumber(e.target.value))}
    />
  );
}

export function MonthlyAmountInput({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  return (
    <TextField
      label="월 납입액"
      placeholder="희망 월 납입액을 입력하세요"
      suffix="원"
      value={value ? formatNumber(value) : ''}
      onChange={e => onChange(parseNumber(e.target.value))}
    />
  );
}

export function SavingTermsSelect({ value, onChange }: { value: number | null; onChange: (value: number) => void }) {
  return (
    <SelectBottomSheet
      label="저축 기간"
      title="저축 기간을 선택해주세요"
      value={value ?? undefined}
      onChange={onChange}
    >
      <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={18}>18개월</SelectBottomSheet.Option>
      <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
    </SelectBottomSheet>
  );
}

const isPositiveInteger = (value: number): boolean => Number.isInteger(value) && value > 0;

function parseNumber(value: string) {
  if (value === '') return null;

  const numericValue = Number(value.replace(/\D/g, ''));
  if (isPositiveInteger(numericValue)) {
    return numericValue;
  }
}
