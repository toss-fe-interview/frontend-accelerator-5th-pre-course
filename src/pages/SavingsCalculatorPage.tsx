import { Suspense, useState } from 'react';
import { Border, NavigationBar, Spacing } from 'tosslib';
import { useSavingsCalculatorForm } from 'hooks/useSavingsCalculatorForm';
import type { SavingsProduct } from 'api/savings';
import { SavingsProductList } from 'components/SavingsProductList';
import { SavingsCalculatorForm } from 'components/SavingsCalculatorForm';
import { SavingsCalculatorResults } from 'components/SavingsCalculatorResults';
import { SavingsCalculatorTabs } from 'components/SavingsCalculatorTabs';

export function SavingsCalculatorPage() {
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | undefined>(undefined);
  const form = useSavingsCalculatorForm();
  const { targetAmount, monthlyAmount, availableTerms } = form.watch();

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <SavingsCalculatorForm control={form.control} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />
      <SavingsCalculatorTabs
        renderContent={tab =>
          tab === 'products' ? (
            <Suspense>
              <SavingsProductList
                monthlyAmount={monthlyAmount}
                availableTerms={availableTerms}
                selectedProductId={selectedProduct?.id}
                onSelectedProduct={setSelectedProduct}
              />
            </Suspense>
          ) : (
            <Suspense>
              <SavingsCalculatorResults
                targetAmount={targetAmount}
                monthlyAmount={monthlyAmount}
                availableTerms={availableTerms}
                selectedProduct={selectedProduct}
              />
            </Suspense>
          )
        }
      />
    </>
  );
}
