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

      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`1,000,000원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="목표 금액과의 차이"
            topProps={{ color: colors.grey600 }}
            bottom={`-500,000원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="추천 월 납입 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`100,000원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      <ListRow
        contents={
          <ListRow.Texts
            type="3RowTypeA"
            top={'기본 정기적금'}
            topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
            middle={`연 이자율: 3.2%`}
            middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
            bottom={`100,000원 ~ 500,000원 | 12개월`}
            bottomProps={{ fontSize: 13, color: colors.grey600 }}
          />
        }
        onClick={() => {}}
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="3RowTypeA"
            top={'고급 정기적금'}
            topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
            middle={`연 이자율: 2.8%`}
            middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
            bottom={`50,000원 ~ 1,000,000원 | 24개월`}
            bottomProps={{ fontSize: 13, color: colors.grey600 }}
          />
        }
        onClick={() => {}}
      />

      <Spacing size={40} /> */}

      {/* 아래는 사용자가 적금 상품을 선택하지 않고 계산 결과 탭을 선택했을 때 출력해주세요. */}
      {/* <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} /> */}
    </>
  );
}

function CalculationResult() {}
