import useSavingsInputs from 'domains/savingsCalculator/hooks/useSavingsInputs';
import SavingsProductList from 'domains/savingsCalculator/containers/SavingsProductList';

import { SavingsProductType } from 'shared/types/api/savings';

import { NavigationBar } from 'tosslib';
import SavingsInputs from 'domains/savingsCalculator/components/SavingsInputs';
import { formatCurrency } from 'shared/utils/format';
import TabScreen from 'shared/components/layout/TabScreen';
import { useState } from 'react';
import CalculationResult from 'domains/savingsCalculator/containers/CalculationResult';

export function SavingsCalculatorPage() {
  const [selectedProduct, setSelectedProduct] = useState<SavingsProductType | null>(null);

  const {
    state: { targetAmount, monthlyPayment, term },
    dispatch,
  } = useSavingsInputs();

  const handleInputChange = (type: 'targetAmount' | 'monthlyPayment' | 'term', value: string) => {
    const formattedValue = value.replace(/[^0-9]/g, '');

    if (type === 'term') {
      return dispatch({ type, payload: Number(formattedValue) });
    }

    if (type === 'targetAmount' || type === 'monthlyPayment') {
      return dispatch({ type, payload: formattedValue });
    }
  };

  const handleProductSelect = (product: SavingsProductType) => {
    setSelectedProduct(product);
  };

  return (
    <TabScreen
      headers={<NavigationBar title="적금 계산기" />}
      topContents={
        <SavingsInputs
          targetAmountProps={{
            value: formatCurrency(Number(targetAmount)),
            onChange: e => handleInputChange('targetAmount', e.target.value),
          }}
          monthlyPaymentProps={{
            value: formatCurrency(Number(monthlyPayment)),
            onChange: e => handleInputChange('monthlyPayment', e.target.value),
          }}
          termProps={{ value: term, onChange: value => handleInputChange('term', value.toString()) }}
        />
      }
      bottomTabs={[
        {
          value: 'products',
          label: '적금 상품',
          contents: (
            <SavingsProductList
              term={term}
              monthlyPayment={Number(monthlyPayment)}
              onSelect={handleProductSelect}
              selectedId={selectedProduct?.id}
            />
          ),
        },
        {
          value: 'results',
          label: '계산 결과',
          contents: (
            <CalculationResult
              userInputs={{
                targetAmount,
                monthlyPayment,
                term,
              }}
              selectedProduct={selectedProduct}
            />
          ),
        },
      ]}
    />
  );
}
