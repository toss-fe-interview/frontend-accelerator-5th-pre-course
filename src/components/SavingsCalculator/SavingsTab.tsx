import { useSavingsProducts } from 'hooks/queries/savings';
import { useDebounce } from 'hooks/useDebounce';
import { useState, useMemo, useEffect } from 'react';
import { SavingsProductItem } from 'services/savings';
import { useSavingsFilterStore } from 'stores/savingsFilterStore';
import { Tab, ListRow, colors, Assets, Border, Spacing, ListHeader } from 'tosslib';
import { calculateSavingsResult } from 'utils/calculate';
import { formatMoney, roundTo } from 'utils/format';

const SAVINGS_TAB_OPTIONS = [
  { value: 'products', title: '적금 상품' },
  { value: 'results', title: '계산 결과' },
] as const;
type SavingsTabValue = (typeof SAVINGS_TAB_OPTIONS)[number]['value'];

export const SavingsTab = () => {
  // 필터 상태
  const { monthlyPay, terms } = useSavingsFilterStore();
  const debouncedMonthlyPay = useDebounce(monthlyPay, 300);

  // 상품 선택
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 탭 상태
  const [tab, setTab] = useState<SavingsTabValue>('products');

  // 적금 상품 데이터
  const { data, isLoading } = useSavingsProducts();
  const allSavingsList = useMemo(() => data ?? [], [data]);
  const filterdSavingsList = useMemo(
    () =>
      allSavingsList
        .filter(item => item.minMonthlyAmount <= debouncedMonthlyPay && debouncedMonthlyPay <= item.maxMonthlyAmount)
        .filter(item => item.availableTerms === terms),
    [allSavingsList, debouncedMonthlyPay, terms]
  );
  const recommendedSavingsList = filterdSavingsList.sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

  // 상품 리스트 데이터 변경 시 선택 상품 초기화
  useEffect(() => {
    if (!filterdSavingsList.find(item => item.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filterdSavingsList, selectedId]);

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
            // 적금 상품 목록
            <SavingsProductsList
              filterdSavingsList={filterdSavingsList}
              selectedId={selectedId}
              changeSelectedId={value => {
                if (filterdSavingsList.find(item => item.id === value)) {
                  setSelectedId(value);
                }
              }}
            />
          )}

          {tab === 'results' && (
            <>
              {/* 계산 결과 */}
              <CalculatedResult selectedId={selectedId} />

              <Border height={16} />
              <Spacing size={8} />

              {/* 추천 상품 목록 */}
              <ListHeader
                title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
              />
              <Spacing size={12} />
              <RecommendedList selectedId={selectedId} recommendedSavingsList={recommendedSavingsList} />

              <Spacing size={40} />
            </>
          )}
        </>
      )}
    </>
  );
};

interface SavingsProductsListProps {
  filterdSavingsList: SavingsProductItem[];
  selectedId: string | null;
  changeSelectedId: (value: string | null) => void;
}

const SavingsProductsList = ({ filterdSavingsList, selectedId, changeSelectedId }: SavingsProductsListProps) => {
  return (
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
                  changeSelectedId(null);
                } else {
                  changeSelectedId(item.id);
                }
              }}
            />
          ))}
        </>
      ) : (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="조건에 맞는 결과가 없습니다." />} />
      )}
    </>
  );
};

interface CalculatedResultProps {
  selectedId: string | null;
}

const CalculatedResult = ({ selectedId }: CalculatedResultProps) => {
  const { goal, monthlyPay } = useSavingsFilterStore();
  const { data } = useSavingsProducts();

  const debouncedGoal = useDebounce(goal, 300);
  const debouncedMonthlyPay = useDebounce(monthlyPay, 300);

  const selectedSavings = data?.find(item => item.id === selectedId);
  const results = selectedSavings ? calculateSavingsResult(debouncedGoal, debouncedMonthlyPay, selectedSavings) : null;

  return (
    <>
      {results ? (
        <>
          <Spacing size={8} />

          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="예상 수익 금액"
                topProps={{ color: colors.grey600 }}
                bottom={formatMoney(roundTo(results.expectedProfit, 1), '원', 'ko-KR')}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
              />
            }
          />
          {goal > 0 ? (
            <ListRow
              contents={
                <ListRow.Texts
                  type="2RowTypeA"
                  top="목표 금액과의 차이"
                  topProps={{ color: colors.grey600 }}
                  bottom={formatMoney(roundTo(results.goalResultDiff, 1), '원', 'ko-KR')}
                  bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                />
              }
            />
          ) : (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="목표 금액을 입력해주세요." />} />
          )}
          {goal > 0 ? (
            <ListRow
              contents={
                <ListRow.Texts
                  type="2RowTypeA"
                  top="추천 월 납입 금액"
                  topProps={{ color: colors.grey600 }}
                  bottom={formatMoney(roundTo(results.recommendedMonthlyPay, 1000), '원', 'ko-KR')}
                  bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                />
              }
            />
          ) : (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="목표 금액을 입력해주세요." />} />
          )}

          <Spacing size={8} />
        </>
      ) : (
        <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
      )}
    </>
  );
};

interface RecommendedListProps {
  recommendedSavingsList: SavingsProductItem[];
  selectedId: string | null;
}

const RecommendedList = ({ recommendedSavingsList, selectedId }: RecommendedListProps) => {
  return (
    <>
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
    </>
  );
};
