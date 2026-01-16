import { Border, ListHeader, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { useState } from 'react';
import { getSavingsProducts, SavingsProduct } from 'api/product';
import { CheckCircleIcon } from 'components/CheckCircleIcon';
import { GoalAmountInput } from 'components/GoalAmountInput';
import { MonthlyPaymentInput } from 'components/MonthlyPaymentInput';
import { Product } from 'components/Product';
import { ResultItem } from 'components/ResultItem';
import { SavingPeriodSelect } from 'components/SavingPeriodSelect';
import { useTabState, Tab as TabType } from 'hooks/useTabState';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { roundToThousand } from 'util/number';

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
  const { selectedTab, setSelectedTab } = useTabState();

  const { data: savingsProducts } = useSuspenseQuery(productQueries.all());

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <GoalAmountInput value={targetAmount} onChange={v => setValue('targetAmount', v)} />
      <Spacing size={16} />
      <MonthlyPaymentInput value={monthlyPayment} onChange={v => setValue('monthlyPayment', v)} />
      <Spacing size={16} />
      <SavingPeriodSelect value={savingPeriod} onChange={v => setValue('savingPeriod', v)} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab
        onChange={value => {
          setSelectedTab(value as TabType);
        }}
      >
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === 'products' &&
        (() => {
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
        })()}
      {selectedTab === 'results' && (
        <>
          <Spacing size={8} />

          {!selectedSavingsProduct ? (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          ) : (
            <>
              <ResultItem
                label="예상 수익 금액"
                value={calculateExpectedProfit(monthlyPayment, savingPeriod, selectedSavingsProduct.annualRate)}
              />
              <ResultItem
                label="목표 금액과의 차이"
                value={calculateDifferenceWithTargetAmount(
                  targetAmount,
                  calculateExpectedProfit(monthlyPayment, savingPeriod, selectedSavingsProduct.annualRate)
                )}
              />
              <ResultItem
                label="추천 월 납입 금액"
                value={calculateRecommendedMonthlyPayment(
                  targetAmount,
                  savingPeriod,
                  selectedSavingsProduct.annualRate
                )}
              />
            </>
          )}

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          {(() => {
            return savingsProducts
              .filter(product => {
                return (
                  product.minMonthlyAmount < monthlyPayment &&
                  product.maxMonthlyAmount > monthlyPayment &&
                  product.availableTerms === savingPeriod
                );
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
              });
          })()}

          <Spacing size={40} />
        </>
      )}
    </>
  );
}

const calculateExpectedProfit = (monthlyPayment: number, savingPeriod: number, annualRate: number) => {
  return monthlyPayment * savingPeriod * (1 + annualRate * 0.5);
};

const calculateDifferenceWithTargetAmount = (targetAmount: number, expectedProfit: number) => {
  return targetAmount - expectedProfit;
};

const calculateRecommendedMonthlyPayment = (targetAmount: number, savingPeriod: number, annualRate: number) => {
  const recommendedAmount = targetAmount / (savingPeriod * (1 + annualRate * 0.5));
  return roundToThousand(recommendedAmount);
};
