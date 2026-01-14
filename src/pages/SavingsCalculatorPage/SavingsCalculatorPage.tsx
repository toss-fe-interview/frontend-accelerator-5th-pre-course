import { NavigationBar, SelectBottomSheet, Spacing, TextField } from 'tosslib';
import { Controller, useForm } from 'react-hook-form';
import { onlyNumbers } from 'utils/input';
import { SavingsCalculatorContent } from './components/SavingsCalculatorContent';
import { formatCurrency } from 'utils/format';

interface SavingsFilterForm {
  targetAmount: number | null;
  monthlyPayment: number | null;
  term: 6 | 12 | 24;
}

export function SavingsCalculatorPage() {
  const form = useForm<SavingsFilterForm>({
    defaultValues: {
      targetAmount: null,
      monthlyPayment: null,
      term: 12, // 임의로 기본값 12개월
    },
  });

  const [targetAmount, monthlyPayment, term] = form.watch(['targetAmount', 'monthlyPayment', 'term']);

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      {/*  입력값  */}
      <Controller
        name="targetAmount"
        control={form.control}
        render={({ field }) => (
          <TextField
            label="목표 금액"
            placeholder="목표 금액을 입력하세요"
            suffix="원"
            value={field.value ? formatCurrency(field.value) : ''}
            onChange={event => {
              const numbersOnly = onlyNumbers(event.target.value);
              field.onChange(Number(numbersOnly));
            }}
          />
        )}
      />
      <Spacing size={16} />

      <Controller
        name="monthlyPayment"
        control={form.control}
        render={({ field }) => (
          <TextField
            label="월 납입액"
            placeholder="희망 월 납입액을 입력하세요"
            suffix="원"
            value={field.value ? formatCurrency(field.value) : ''}
            onChange={event => {
              const numbersOnly = onlyNumbers(event.target.value);
              field.onChange(Number(numbersOnly));
            }}
          />
        )}
      />
      <Spacing size={16} />

      <Controller
        name="term"
        control={form.control}
        render={({ field }) => (
          <SelectBottomSheet
            label="저축 기간"
            title="저축 기간을 선택해주세요"
            value={field.value}
            onChange={field.onChange}
          >
            <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
            <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
            <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
          </SelectBottomSheet>
        )}
      />
      <Spacing size={24} />

      {/* 탭 - 컨텐츠 */}
      <SavingsCalculatorContent targetAmount={targetAmount} monthlyPayment={monthlyPayment} term={term} />

      {/* 아래는 계산 결과 탭 내용이에요. 계산 결과 탭을 구현할 때 주석을 해제해주세요. */}
      {/* <Spacing size={8} />

       */}

      {/* 아래는 사용자가 적금 상품을 선택하지 않고 계산 결과 탭을 선택했을 때 출력해주세요. */}
      {/* <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} /> */}
    </>
  );
}
