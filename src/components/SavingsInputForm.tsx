import { SavingsInput } from 'type';
import { SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { formatMoney, parseMoney } from 'utils/money';

interface SavingsInputFormProps {
  savingsInput: SavingsInput;
  setSavingsInput: (savingsInput: SavingsInput) => void;
}

export function SavingsInputForm(props: SavingsInputFormProps) {
  const { savingsInput, setSavingsInput } = props;
  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={formatMoney(savingsInput.goalAmount)}
        onChange={value =>
          setSavingsInput({ ...savingsInput, goalAmount: Number(parseMoney(value.target.value)) || 0 })
        }
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={formatMoney(savingsInput.monthlyAmount)}
        onChange={value =>
          setSavingsInput({ ...savingsInput, monthlyAmount: Number(parseMoney(value.target.value)) || 0 })
        }
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsInput.term}
        onChange={value => setSavingsInput({ ...savingsInput, term: value })}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
    </>
  );
}
