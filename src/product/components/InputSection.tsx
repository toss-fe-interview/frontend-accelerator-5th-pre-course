import { TERMS_OPTIONS } from 'product/constants';
import { Spacing, TextField, SelectBottomSheet } from 'tosslib';

interface Props {
  price: string;
  monthlyPayment: string;
  term: number | null;
  handlePriceChange: (value: string) => void;
  handleMonthlyPaymentChange: (value: string) => void;
  handleTermChange: (value: number) => void;
}

const InputSection = ({
  price,
  monthlyPayment,
  term,
  handlePriceChange,
  handleMonthlyPaymentChange,
  handleTermChange,
}: Props) => {
  return (
    <>
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={price}
        onChange={e => handlePriceChange(e.target.value)}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyPayment}
        onChange={e => handleMonthlyPaymentChange(e.target.value)}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={term}
        onChange={value => {
          if (value === null) {
            return;
          }

          handleTermChange(value);
        }}
      >
        {TERMS_OPTIONS.map(option => (
          <SelectBottomSheet.Option key={option.value} value={option.value}>
            {option.label}
          </SelectBottomSheet.Option>
        ))}
      </SelectBottomSheet>
    </>
  );
};

export default InputSection;
