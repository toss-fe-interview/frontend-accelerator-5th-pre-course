import SavingCalculator from 'components/SavingCalculator';
import { Suspense } from 'react';
import { NavigationBar, Spacing } from 'tosslib';

export function SavingsCalculatorPage() {
  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />
      {/* TODO. 에러 바운더리 추가해야함. */}
      <Suspense fallback={<></>}>
        <SavingCalculator />
      </Suspense>
    </>
  );
}
