import { useState } from 'react';
import { Border, Button, ListHeader, ListRow, Spacing, Tab } from 'tosslib';
import { arrayIncludes, roundToUnit } from '@shared/utils';
import { SuspenseBoundary, SwitchCase, Delay } from '@shared/ui';
import { calcSavingsResult } from '@savings/utils';
import { useSavingsProducts } from '@savings/hooks/queries';
import { ProductListItem } from './ProductListItem';
import { CalculationResult } from './CalculationResult';
import type { SavingsProduct } from '@savings/apis/type';
import type { SavingsForm } from '@savings/hooks';

type SavingsTabsProps = {
  savingsForm: SavingsForm;
};

type ActiveTab = 'products' | 'results';

export const SavingsTabs = (props: SavingsTabsProps) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('products');

  const handleChangeTab = (value: string) => {
    if (!arrayIncludes(['products', 'results'] as const, value)) {
      return;
    }

    setActiveTab(value);
  };

  return (
    <>
      <Tab onChange={handleChangeTab}>
        <Tab.Item value="products" selected={activeTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={activeTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>
      <SuspenseBoundary
        pendingFallback={
          <Delay>
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="데이터를 불러오고 있어요." />} />
          </Delay>
        }
        rejectedFallback={({ reset }) => (
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="데이터를 불러오는 중 오류가 발생했어요."
                bottom={<Button onClick={reset}>다시 시도</Button>}
              />
            }
          />
        )}
      >
        <Contents activeTab={activeTab} {...props} />
      </SuspenseBoundary>
    </>
  );
};

const Contents = ({ activeTab, savingsForm }: SavingsTabsProps & { activeTab: string }) => {
  const { monthlySaving, savingPeriod } = savingsForm;
  const { data: savingsProducts } = useSavingsProducts({
    filterParams: {
      monthlySaving,
      savingPeriod,
    },
  });
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct>();
  const recommendedProducts = [...savingsProducts].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  const handleClickProduct = (sp: SavingsProduct) => {
    setSelectedProduct(sp);
  };

  return (
    <SwitchCase
      value={activeTab}
      caseBy={{
        products: savingsProducts.map(p => (
          <ProductListItem
            key={p.id}
            savingsProduct={p}
            onClick={handleClickProduct}
            selected={p.id === selectedProduct?.id}
          />
        )),
        results: (
          <>
            <Spacing size={8} />
            {selectedProduct ? (
              (() => {
                const annualRate = selectedProduct?.annualRate || 0;
                const { expectedReturn, differenceFromGoal, recommendedMonthlySaving } = calcSavingsResult(
                  monthlySaving,
                  savingPeriod,
                  annualRate
                );

                return (
                  <CalculationResult
                    result={{
                      expectedReturn: roundToUnit(expectedReturn),
                      differenceFromGoal: roundToUnit(differenceFromGoal),
                      recommendedMonthlySaving: roundToUnit(recommendedMonthlySaving),
                    }}
                  />
                );
              })()
            ) : (
              <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
            )}
            <Spacing size={8} />
            <Border height={16} />
            <Spacing size={8} />
            <ListHeader
              title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
            />
            <Spacing size={12} />
            {recommendedProducts.map(rp => {
              return (
                <ProductListItem
                  key={rp.id}
                  savingsProduct={rp}
                  onClick={handleClickProduct}
                  selected={rp.id === selectedProduct?.id}
                />
              );
            })}
            <Spacing size={40} />
          </>
        ),
      }}
    />
  );
};
