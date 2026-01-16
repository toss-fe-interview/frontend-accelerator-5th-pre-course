import { Border, ListHeader, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { useState } from 'react';
import { getSavingsProducts, SavingsProduct } from 'api/product';
import { CheckCircleIcon } from 'components/CheckCircleIcon';
import { GoalAmountInput } from 'components/GoalAmountInput';
import { MonthlyPaymentInput } from 'components/MonthlyPaymentInput';
import { Product } from 'components/Product';
import { CalculationResultItem } from 'components/CalculationResultItem';
import { SavingPeriodSelect } from 'components/SavingPeriodSelect';
import { useTabState, Tab as TabType } from 'hooks/useTabState';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { roundToThousand } from 'util/number';
import { EmptyMessage } from 'components/EmptyMessage';

const productQueries = {
  all: () =>
    queryOptions({
      queryKey: ['savingsProducts'],
      queryFn: getSavingsProducts,
    }),
};

interface SavingsFormData {
  targetAmount: number;
  monthlyPayment: number;
  savingPeriod: number;
}

export function SavingsCalculatorPage() {
  const { watch, setValue } = useForm<SavingsFormData>({
    defaultValues: {
      targetAmount: 0,
      monthlyPayment: 0,
      savingPeriod: 12,
    },
  });
  const { targetAmount, monthlyPayment, savingPeriod } = watch();
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);
  const { tab, setTab } = useTabState();

  const { data: savingsProducts } = useSuspenseQuery(productQueries.all());

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <GoalAmountInput value={targetAmount} onChange={v => setValue('targetAmount', v)} />
      <Spacing size={16} />
      <MonthlyPaymentInput value={monthlyPayment} onChange={v => setValue('monthlyPayment', v)} />
      <Spacing size={16} />
      <SavingPeriodSelect
        value={savingPeriod}
        onChange={v => setValue('savingPeriod', v)}
        options={[
          { value: 6, label: '6개월' },
          { value: 12, label: '12개월' },
          { value: 24, label: '24개월' },
        ]}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab
        onChange={value => {
          setTab(value as TabType);
        }}
      >
        <Tab.Item value="products" selected={tab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={tab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {(() => {
        switch (tab) {
          case 'products':
            return savingsProducts
              .filter(product => {
                return (
                  product.minMonthlyAmount < monthlyPayment &&
                  product.maxMonthlyAmount > monthlyPayment &&
                  product.availableTerms === savingPeriod
                );
              })
              .map(product => {
                const isSelected = selectedSavingsProduct?.id === product.id;
                return (
                  <ListRow
                    key={product.id}
                    contents={
                      <Product
                        name={product.name}
                        annualRate={product.annualRate}
                        minMonthlyAmount={product.minMonthlyAmount}
                        maxMonthlyAmount={product.maxMonthlyAmount}
                        availableTerms={product.availableTerms}
                      />
                    }
                    right={isSelected ? <CheckCircleIcon /> : null}
                    onClick={() => {
                      setSelectedSavingsProduct(product);
                    }}
                  />
                );
              });

          case 'results':
            return (
              <>
                <Spacing size={8} />

                {selectedSavingsProduct ? (
                  <>
                    <CalculationResultItem
                      label="예상 수익 금액"
                      value={monthlyPayment * savingPeriod * (1 + selectedSavingsProduct.annualRate * 0.5)}
                    />
                    <CalculationResultItem
                      label="목표 금액과의 차이"
                      value={
                        targetAmount - monthlyPayment * savingPeriod * (1 + selectedSavingsProduct.annualRate * 0.5)
                      }
                    />
                    <CalculationResultItem
                      label="추천 월 납입 금액"
                      value={roundToThousand(
                        targetAmount / (savingPeriod * (1 + selectedSavingsProduct.annualRate * 0.5))
                      )}
                    />
                  </>
                ) : (
                  <EmptyMessage message="상품을 선택해주세요." />
                )}

                <Spacing size={8} />
                <Border height={16} />
                <Spacing size={8} />

                <ListHeader
                  title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
                />
                <Spacing size={12} />

                {savingsProducts
                  .filter(product => {
                    const isAboveMinPayment = product.minMonthlyAmount < monthlyPayment;
                    const isBelowMaxPayment = product.maxMonthlyAmount > monthlyPayment;
                    const matchesSavingPeriod = product.availableTerms === savingPeriod;

                    return isAboveMinPayment && isBelowMaxPayment && matchesSavingPeriod;
                  })
                  .sort((a, b) => b.annualRate - a.annualRate)
                  .slice(0, 2)
                  .map(product => {
                    const isSelected = selectedSavingsProduct?.id === product.id;

                    return (
                      <ListRow
                        key={product.id}
                        contents={
                          <Product
                            name={product.name}
                            annualRate={product.annualRate}
                            minMonthlyAmount={product.minMonthlyAmount}
                            maxMonthlyAmount={product.maxMonthlyAmount}
                            availableTerms={product.availableTerms}
                          />
                        }
                        right={isSelected ? <CheckCircleIcon /> : null}
                        onClick={() => {
                          setSelectedSavingsProduct(product);
                        }}
                      />
                    );
                  })}

                <Spacing size={40} />
              </>
            );
        }
      })()}
    </>
  );
}
