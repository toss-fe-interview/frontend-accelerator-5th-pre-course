import { Border, colors, ListRow, NavigationBar, Spacing, Tab, http, isHttpError } from 'tosslib';
import { useEffect, useMemo, useState } from 'react';
import SavingsInputForm from 'components/SavingsInputForm';
import { formatMoney } from 'utils/money';

type SavingsProduct = {
  id: string;
  name: string;
  annualRate: number;
  // 최소 월 납입액
  minMonthlyAmount: number;
  // 최대 월 납입액
  maxMonthlyAmount: number;
  // 저축 기간
  availableTerms: number;
};

export type SavingsInput = {
  goalAmount: string;
  monthlyAmount: string;
  term: number;
};

export function SavingsCalculatorPage() {
  const [savingsProducts, setSavingsProducts] = useState<SavingsProduct[]>([]);

  const [savingsInput, setSavingsInput] = useState<SavingsInput>({
    goalAmount: '',
    monthlyAmount: '',
    term: 0,
  });

  // 필터링 조건에 맞게 상품 목록 필터링
  const filteredSavingsProducts = useMemo(() => {
    // 월 납입액 필터링
    const filteredByMonthlyAmount = savingsProducts.filter(product => {
      return (
        product.minMonthlyAmount <= Number(savingsInput.monthlyAmount) &&
        product.maxMonthlyAmount >= Number(savingsInput.monthlyAmount)
      );
    });

    // 저축 기간 필터링
    const filteredByTerm = filteredByMonthlyAmount.filter(product => {
      return product.availableTerms === savingsInput.term;
    });

    return filteredByTerm;
  }, [savingsProducts, savingsInput]);

  useEffect(() => {
    const fetchSavingsProducts = async () => {
      try {
        const response = await http.get<SavingsProduct[]>('/api/savings-products');
        setSavingsProducts(response);
      } catch (error) {
        if (isHttpError(error)) {
          console.error(error.message);
        } else {
          console.error(error);
        }
      }
    };
    fetchSavingsProducts();
  }, []);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsInputForm savingsInput={savingsInput} setSavingsInput={setSavingsInput} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={() => {}}>
        <Tab.Item value="products" selected={true}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={false}>
          계산 결과
        </Tab.Item>
      </Tab>

      {filteredSavingsProducts.map(product => (
        <ListRow
          key={product.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${product.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${formatMoney(product.minMonthlyAmount)}원 ~ ${formatMoney(product.maxMonthlyAmount)}원 | ${product.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          // right={<Assets.Icon name="icon-check-circle-green" />}
          onClick={() => {}}
        />
      ))}

      {/* 아래는 계산 결과 탭 내용이에요. 계산 결과 탭을 구현할 때 주석을 해제해주세요. */}
      {/* <Spacing size={8} />

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
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      <ListRow
        contents={
          <ListRow.Texts
            type="3RowTypeA"
            top={'기본 정기적금'}
            topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
            middle={`연 이자율: 3.2%`}
            middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
            bottom={`100,000원 ~ 500,000원 | 12개월`}
            bottomProps={{ fontSize: 13, color: colors.grey600 }}
          />
        }
        onClick={() => {}}
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="3RowTypeA"
            top={'고급 정기적금'}
            topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
            middle={`연 이자율: 2.8%`}
            middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
            bottom={`50,000원 ~ 1,000,000원 | 24개월`}
            bottomProps={{ fontSize: 13, color: colors.grey600 }}
          />
        }
        onClick={() => {}}
      />

      <Spacing size={40} /> */}

      {/* 아래는 사용자가 적금 상품을 선택하지 않고 계산 결과 탭을 선택했을 때 출력해주세요. */}
      {/* <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} /> */}
    </>
  );
}
