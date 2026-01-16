import { ListRow, NavigationBar, Spacing } from 'tosslib';
import { useForm } from 'react-hook-form';
import { SavingsCalculatorContents } from './components/SavingsCalculatorContents';
import { SavingsFilterForm } from './types/saving-filter-form';
import { AsyncBoundary } from 'components/AsyncBoundary';
import { SavingProductErrorFallback } from './components/fallback/SavingProductErrorFallback';
import { CurrencyTextField } from './components/fields/CurrencyTextField';
import { SelectTermField } from './components/fields/SelectTermField';

export function SavingsCalculatorPage() {
  const form = useForm<SavingsFilterForm>({
    defaultValues: {
      targetAmount: null,
      monthlyPayment: null,
      term: 12,
    },
  });

  const [targetAmount, monthlyPayment, term] = form.watch(['targetAmount', 'monthlyPayment', 'term']);

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      {/* TODO: Flex 컴포넌트 */}
      <div css={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <CurrencyTextField
          label="목표 금액"
          placeholder="목표 금액을 입력하세요"
          value={targetAmount}
          onChange={value => form.setValue('targetAmount', value)}
        />
        <CurrencyTextField
          label="월 납입액"
          placeholder="희망 월 납입액을 입력하세요"
          value={monthlyPayment}
          onChange={value => form.setValue('monthlyPayment', value)}
        />
        <SelectTermField
          label="저축 기간"
          title="저축 기간을 선택해주세요"
          options={[
            { value: 6, label: '6개월' },
            { value: 12, label: '12개월' },
            { value: 24, label: '24개월' },
          ]}
          value={term}
          onSelect={value => form.setValue('term', value)}
        />
      </div>
      <Spacing size={24} />

      <AsyncBoundary
        pendingFallback={<ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품 정보를 불러오는 중..." />} />}
        rejectedFallback={SavingProductErrorFallback}
      >
        <SavingsCalculatorContents targetAmount={targetAmount} monthlyPayment={monthlyPayment} term={term} />
      </AsyncBoundary>
      <Spacing size={40} />
    </>
  );
}
