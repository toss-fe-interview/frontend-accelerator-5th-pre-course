import { SelectBottomSheet, Spacing, TextField } from 'tosslib';

export interface InputValues {
  targetAmount: string;
  monthlyDeposit: string;
  term: number;
}

interface InputSectionProps {
  values: InputValues;
  onChange: (values: Partial<InputValues>) => void;
}

export function InputSection({ values, onChange }: InputSectionProps) {
  return (
    <>
      <Spacing size={16} />
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={values.targetAmount}
        onChange={e => onChange({ targetAmount: e.target.value })}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={values.monthlyDeposit}
        onChange={e => onChange({ monthlyDeposit: e.target.value })}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={values.term}
        onChange={value => onChange({ term: value })}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
}
