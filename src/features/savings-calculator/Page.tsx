import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Assets, Border, colors, ListHeader, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';
import { formatNumber } from 'utils/format';
import { roundToThousand } from 'utils/roundToThousand';
import { savingsProductsQueries } from './api/queries';
import { MonthlyAmountInput, SavingTermsSelect, TargetAmountInput } from './components/CalculatorFields';
import SavingsProductInfo from './components/SavingsProductInfo';
import { useCalculatorParams } from './hooks/useCalculatorParams';
import { useSelectProductParams } from './hooks/useSelectProductParams';
import { byHighestAnnualRate, matchesPaymentRange, matchesPeriod } from './utils/productFilters';

const TABS_CONFIG = {
  products: '적금 상품',
  results: '계산 결과',
} as const;

type TabKey = keyof typeof TABS_CONFIG;
const isValidTabKey = (tab: string): tab is TabKey => tab in TABS_CONFIG;

export default function SavingsCalculatorPage() {
  const { data: products } = useSuspenseQuery(savingsProductsQueries.listQuery());

  const { targetAmount, monthlyAmount, savingTerms, setCalculatorParams } = useCalculatorParams();
  const { selectedProductId, setSelectedProductId } = useSelectProductParams();
  const [currentTab, setCurrentTab] = useState<TabKey>('products');

  const filteredProducts = products.filter(matchesPaymentRange(monthlyAmount)).filter(matchesPeriod(savingTerms));

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TargetAmountInput
        label="목표 금액"
        value={targetAmount}
        onChange={value => setCalculatorParams({ targetAmount: value })}
      />
      <Spacing size={16} />
      <MonthlyAmountInput
        label="월 납입액"
        value={monthlyAmount}
        onChange={value => setCalculatorParams({ monthlyAmount: value })}
      />
      <Spacing size={16} />
      <SavingTermsSelect
        label="저축 기간"
        value={savingTerms}
        onChange={value => setCalculatorParams({ savingTerms: value })}
      />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={tab => (isValidTabKey(tab) ? setCurrentTab(tab) : undefined)}>
        {Object.entries(TABS_CONFIG).map(([tab, label]) => (
          <Tab.Item key={tab} value={tab} selected={currentTab === tab}>
            {label}
          </Tab.Item>
        ))}
      </Tab>
      {(() => {
        switch (currentTab) {
          case 'products':
            return filteredProducts.length > 0 ? (
              filteredProducts.map(product => {
                const isSelected = selectedProductId === product.id;
                return (
                  <ListRow
                    key={product.id}
                    contents={<SavingsProductInfo product={product} />}
                    right={isSelected ? <CheckedCircleIcon /> : null}
                    onClick={() => setSelectedProductId(product.id)}
                  />
                );
              })
            ) : (
              <EmptyMessage message="조건에 맞는 상품이 없습니다." />
            );
          case 'results': {
            const recommendedProducts = filteredProducts.sort(byHighestAnnualRate).slice(0, 2);
            const selectedProduct = products.find(product => product.id === selectedProductId);

            const 예상만기금액 =
              selectedProduct && savingTerms
                ? get_예상만기금액({
                    월납입액: monthlyAmount ?? 0,
                    저축기간: savingTerms,
                    연이자율: selectedProduct.annualRate,
                  })
                : 0;
            const 목표금액과의차이 = get_목표금액과의차이({
              목표금액: targetAmount ?? 0,
              예상만기금액,
            });
            const 추천월납입금액 =
              selectedProduct && savingTerms
                ? get_추천월납입금액({
                    목표금액: targetAmount ?? 0,
                    저축기간: savingTerms,
                    연이자율: selectedProduct.annualRate,
                  })
                : 0;

            return (
              <>
                <Spacing size={8} />
                {selectedProduct ? (
                  savingTerms ? (
                    <>
                      <ResultRow label="예상 수익 금액" value={`${formatNumber(예상만기금액)}원`} />
                      <ResultRow label="목표 금액과의 차이" value={`${formatNumber(목표금액과의차이)}원`} />
                      <ResultRow label="추천 월 납입 금액" value={`${formatNumber(추천월납입금액)}원`} />
                    </>
                  ) : (
                    <EmptyMessage message="저축 기간을 선택해주세요." />
                  )
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
                {recommendedProducts.length > 0 ? (
                  recommendedProducts.map(product => {
                    const isSelected = selectedProductId === product.id;
                    return (
                      <ListRow
                        key={product.id}
                        contents={<SavingsProductInfo product={product} />}
                        right={isSelected ? <CheckedCircleIcon /> : null}
                        onClick={() => setSelectedProductId(product.id)}
                      />
                    );
                  })
                ) : (
                  <EmptyMessage message="조건에 맞는 상품이 없습니다." />
                )}
                <Spacing size={40} />
              </>
            );
          }
          default: {
            const _exhaustiveCheck: never = currentTab;
            return _exhaustiveCheck;
          }
        }
      })()}
    </>
  );
}

function CheckedCircleIcon() {
  return <Assets.Icon name="icon-check-circle-green" />;
}

function EmptyMessage({ message }: { message: string }) {
  return <ListRow contents={<ListRow.Texts type="1RowTypeA" top={message} />} />;
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="2RowTypeA"
          top={label}
          topProps={{ color: colors.grey600 }}
          bottom={value}
          bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
        />
      }
    />
  );
}

const 평균적립기간비율 = 0.5;

const get_예상만기금액 = ({
  월납입액,
  저축기간,
  연이자율,
}: {
  월납입액: number;
  저축기간: number;
  연이자율: number;
}) => {
  return 월납입액 * 저축기간 * (1 + (연이자율 / 100) * 평균적립기간비율);
};

const get_목표금액과의차이 = ({ 목표금액, 예상만기금액 }: { 목표금액: number; 예상만기금액: number }) => {
  return 목표금액 - 예상만기금액;
};

const get_추천월납입금액 = ({
  목표금액,
  저축기간,
  연이자율,
}: {
  목표금액: number;
  저축기간: number;
  연이자율: number;
}) => {
  const value = 목표금액 / (저축기간 * (1 + (연이자율 / 100) * 평균적립기간비율));
  return roundToThousand(value);
};
