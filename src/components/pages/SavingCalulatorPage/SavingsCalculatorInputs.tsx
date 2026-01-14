import { SelectBottomSheet, Spacing } from 'tosslib';
import { Controller, useFormContext } from 'react-hook-form';
import { TextFieldForKRW } from 'components/common/TextFieldForKRW';

export const SavingsCalculatorInputs = () => {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        name="targetAmount"
        control={control}
        render={({ field }) => (
          <TextFieldForKRW
            label="목표 금액"
            placeholder="목표 금액을 입력하세요"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Spacing size={16} />
      <Controller
        name="monthlyAmount"
        control={control}
        render={({ field }) => (
          <TextFieldForKRW
            label="월 납입액"
            placeholder="희망 월 납입액을 입력하세요"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Spacing size={16} />
      <Controller
        name="term"
        control={control}
        render={({ field }) => (
          <SelectBottomSheet label="저축 기간" title="저축 기간을 선택해주세요" {...field}>
            <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
            <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
            <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
          </SelectBottomSheet>
        )}
      />
    </>
  );
};
