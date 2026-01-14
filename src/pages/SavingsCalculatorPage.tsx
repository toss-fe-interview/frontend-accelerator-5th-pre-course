import { useQuery } from '@tanstack/react-query';
import { SavingsQueryOption } from 'domain/savings/api/SavingsQueryOption';
import { SavingsResponse } from 'domain/savings/api/type';
import { SavingCalculateResults } from 'domain/savings/components/SavingCalculateResults';
import { SavingItem } from 'domain/savings/components/SavingItem';
import { SavingsFilter } from 'domain/savings/components/SavingsFilter';
import { SavingsList } from 'domain/savings/components/SavingsList';
import { useCalculateExpectedProfit } from 'domain/savings/hooks/useCalculateExpectedProfit';
import { useFilterSavings } from 'domain/savings/hooks/useFilterSavings';
import { useRecommendSavings } from 'domain/savings/hooks/useRecommendSavings';
import { useSavingForm } from 'domain/savings/hooks/useSavingForm';
import { useState } from 'react';
import { Border, ListHeader, ListRow, NavigationBar, Spacing, Tab } from 'tosslib';

type Tab = 'products' | 'results';

export function SavingsCalculatorPage() {
  const { data: savings } = useQuery(SavingsQueryOption.getSavings);

  const [selectedSaving, setSelectedSaving] = useState<SavingsResponse | null>(null);
  const [tab, setTab] = useState<Tab>('products');

  const filterForm = useSavingForm();
  const { filteredSavings } = useFilterSavings({
    savings: savings ?? [],
    monthlyAmount: filterForm.watch('monthlyAmount'),
    terms: filterForm.watch('terms'),
  });
  const { getExpectedProfit, getDiffBetweenGoalAndExpectedProfit, getRecommendedMonthlyAmount } =
    useCalculateExpectedProfit({
      saving: selectedSaving,
      goalAmount: filterForm.watch('goalAmount'),
      monthlyAmount: filterForm.watch('monthlyAmount'),
    });
  const { getRecommendSavings } = useRecommendSavings();

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsFilter filterForm={filterForm} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setTab(value as Tab)}>
        <Tab.Item value="products" selected={tab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={tab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {tab === 'products' && (
        <SavingsList savings={filteredSavings} selectedSaving={selectedSaving} onSelectSaving={setSelectedSaving} />
      )}

      {tab === 'results' && (
        <>
          {!selectedSaving && <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />}
          {selectedSaving && (
            <SavingCalculateResults
              expectedProfit={getExpectedProfit()}
              diffBetweenGoalAndExpectedProfit={getDiffBetweenGoalAndExpectedProfit()}
              recommendedMonthlyAmount={getRecommendedMonthlyAmount()}
            />
          )}
        </>
      )}

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      {getRecommendSavings(filteredSavings).map(saving => (
        <SavingItem
          key={saving.id}
          saving={saving}
          isSelected={selectedSaving?.id === saving.id}
          onSelect={setSelectedSaving}
        />
      ))}

      <Spacing size={40} />

      {/* 아래는 사용자가 적금 상품을 선택하지 않고 계산 결과 탭을 선택했을 때 출력해주세요. */}
      {/* <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} /> */}
    </>
  );
}
