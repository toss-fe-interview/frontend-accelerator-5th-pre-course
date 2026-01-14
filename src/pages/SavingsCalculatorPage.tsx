import MoneyTextField from 'components/MoneyTextField';
import { useSavingsProducts } from 'hooks/queries/savings';
import { useDebounce } from 'hooks/useDebounce';
import { useState } from 'react';
import { useSavingsFilterStore } from 'stores/savingsFilterStore';
import { Assets, Border, colors, ListHeader, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab } from 'tosslib';
import { formatMoney } from 'utils/format';

export function SavingsCalculatorPage() {
  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsFilter />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <SavingsTab />
    </>
  );
}

export const TERMS_SELECT_OPTION = [
  { value: 6, title: '6개월' },
  { value: 12, title: '12개월' },
  { value: 24, title: '24개월' },
] as const;

export type TermsValue = (typeof TERMS_SELECT_OPTION)[number]['value'];

const SavingsFilter = () => {
  const { goal, changeGoal, monthlyPay, changeMonthlyPay, terms, changeTerms } = useSavingsFilterStore();

  return (
    <>
      <MoneyTextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        locale="ko-KR"
        value={goal}
        onValueChange={changeGoal}
      />
      <Spacing size={16} />
      <MoneyTextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        locale="ko-KR"
        value={monthlyPay}
        onValueChange={changeMonthlyPay}
      />
      <Spacing size={16} />
      <SelectBottomSheet label="저축 기간" title="저축 기간을 선택해주세요" value={terms} onChange={changeTerms}>
        {TERMS_SELECT_OPTION.map(opt => (
          <SelectBottomSheet.Option key={`terms-opt-${opt.value}`} value={opt.value}>
            {opt.title}
          </SelectBottomSheet.Option>
        ))}
      </SelectBottomSheet>
    </>
  );
};

const SAVINGS_TAB_OPTIONS = [
  { value: 'products', title: '적금 상품' },
  { value: 'results', title: '계산 결과' },
] as const;
type SavingsTabValue = (typeof SAVINGS_TAB_OPTIONS)[number]['value'];

const SavingsTab = () => {
  const { data, isLoading } = useSavingsProducts();
  const { monthlyPay, terms } = useSavingsFilterStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<SavingsTabValue>('products');
  const allSavingsList = data ?? [];

  const debouncedMonthlyPay = useDebounce(monthlyPay, 300);

  const filterdSavingsList = allSavingsList
    .filter(item => item.minMonthlyAmount <= debouncedMonthlyPay && debouncedMonthlyPay <= item.maxMonthlyAmount)
    .filter(item => item.availableTerms === terms);

  const recommendedSavingsList = filterdSavingsList.sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  return (
    <>
      <Tab onChange={newTab => setTab(newTab as SavingsTabValue)}>
        {SAVINGS_TAB_OPTIONS.map(opt => (
          <Tab.Item key={`savings-tab-${opt.value}`} value={opt.value} selected={opt.value === tab}>
            {opt.title}
          </Tab.Item>
        ))}
      </Tab>

      {isLoading ? (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품목록을 가져오고 있습니다." />} />
      ) : (
        <>
          {tab === 'products' && (
            <>
              {filterdSavingsList.length ? (
                <>
                  {filterdSavingsList.map(item => (
                    <ListRow
                      key={`savings-product-${item.id}`}
                      contents={
                        <ListRow.Texts
                          type="3RowTypeA"
                          top={item.name}
                          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                          middle={`연 이자율: ${item.annualRate}%`}
                          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                          bottom={`${formatMoney(item.minMonthlyAmount, '원', 'ko-KR')} ~ ${formatMoney(item.maxMonthlyAmount, '원', 'ko-KR')} | ${item.availableTerms}개월`}
                          bottomProps={{ fontSize: 13, color: colors.grey600 }}
                        />
                      }
                      right={selectedId === item.id && <Assets.Icon name="icon-check-circle-green" />}
                      onClick={() => {
                        if (selectedId === item.id) {
                          setSelectedId(null);
                        } else {
                          setSelectedId(item.id);
                        }
                      }}
                    />
                  ))}
                </>
              ) : (
                <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 결과가 없습니다." />} />
              )}
            </>
          )}

          {tab === 'results' && (
            <>
              {selectedId ? (
                <>
                  <Spacing size={8} />

                  <ListRow
                    contents={
                      <ListRow.Texts
                        type="2RowTypeA"
                        top="예상 수익 금액"
                        topProps={{ color: colors.grey600 }}
                        bottom={`1,000,000원`}
                        bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                      />
                    }
                  />
                  <ListRow
                    contents={
                      <ListRow.Texts
                        type="2RowTypeA"
                        top="목표 금액과의 차이"
                        topProps={{ color: colors.grey600 }}
                        bottom={`-500,000원`}
                        bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                      />
                    }
                  />
                  <ListRow
                    contents={
                      <ListRow.Texts
                        type="2RowTypeA"
                        top="추천 월 납입 금액"
                        topProps={{ color: colors.grey600 }}
                        bottom={`100,000원`}
                        bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                      />
                    }
                  />

                  <Spacing size={8} />
                </>
              ) : (
                <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
              )}
              <Border height={16} />
              <Spacing size={8} />

              <ListHeader
                title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
              />
              <Spacing size={12} />

              {recommendedSavingsList.length ? (
                <>
                  {recommendedSavingsList.map(item => (
                    <ListRow
                      key={`recommend-savings-${item.id}`}
                      contents={
                        <ListRow.Texts
                          type="3RowTypeA"
                          top={item.name}
                          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                          middle={`연 이자율: ${item.annualRate}%`}
                          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                          bottom={`${formatMoney(item.minMonthlyAmount, '원', 'ko-KR')} ~ ${formatMoney(item.maxMonthlyAmount, '원', 'ko-KR')} | ${item.availableTerms}개월`}
                          bottomProps={{ fontSize: 13, color: colors.grey600 }}
                        />
                      }
                      right={selectedId === item.id && <Assets.Icon name="icon-check-circle-green" />}
                    />
                  ))}{' '}
                </>
              ) : (
                <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 결과가 없습니다." />} />
              )}

              <Spacing size={40} />
            </>
          )}
        </>
      )}
    </>
  );
};
