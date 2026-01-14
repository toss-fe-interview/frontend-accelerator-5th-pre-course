import { useSavingsProducts } from 'hooks/queries/useSavingsProducts';
import { useState } from 'react';
import { Assets, Border, colors, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';

/**
 * 2. 저축 목표 입력 기능 만들기
 * - 입력 기능 구현
 * - 유효한 입력값이 되도록 처리 -> 시간 소요 예상
 * - 입력한 값에 따라서 필터링 된 목록이 적금 상품에 보여지도록 처리
 */

type SavingsCalculatorFormState = {
  targetAmount: number;
  monthlyAmount: number;
  term: number;
};

/** TODO:
 * 필터링 조건
 * - 월 납입액
 *    - `product.minMonthlyAmount` (최소 월 납입액)보다 크고
 *    - `product.maxMonthlyAmount` (최대 월 납입액)보다 작아야 함
 * - 저축 기간
 *    - `product.availableTerms` (저축 기간)와 동일해야 함
 */
const filterSavingsProduct = (savingsProduct: SavingsProduct, formState: SavingsCalculatorFormState) => {};

const formatAmount = (amount: number) => amount.toLocaleString('ko-KR');

const formatTextFieldValue = (amount: number) => {
  return amount > 0 ? formatAmount(amount) : '';
};

export function SavingsCalculatorPage() {
  const { data: savingsProducts } = useSavingsProducts();
  const [formState, setFormState] = useState<SavingsCalculatorFormState>({
    targetAmount: 0,
    monthlyAmount: 0,
    term: 12,
  });

  const handleChangeTextField = (key: keyof SavingsCalculatorFormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '') {
      setFormState({ ...formState, [key]: 0 });
      return;
    }

    const digits = value.replace(/[^0-9]/g, '');
    const parsedValue = Number(digits);

    if (isNaN(parsedValue) || parsedValue <= 0) {
      return;
    }
    setFormState({ ...formState, [key]: parsedValue });
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      {/* 계산기 form 영역 */}
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={formatTextFieldValue(formState.targetAmount)}
        onChange={handleChangeTextField('targetAmount')}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={formatTextFieldValue(formState.monthlyAmount)}
        onChange={handleChangeTextField('monthlyAmount')}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={formState.term}
        onChange={value => setFormState({ ...formState, term: Number(value) })}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      {/* Tab 버튼 영역 */}
      <Tab onChange={() => {}}>
        <Tab.Item value="products" selected={true}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={false}>
          계산 결과
        </Tab.Item>
      </Tab>

      {/* 적금 상품 리스트 영역 */}
      <>
        {savingsProducts.map(savingsProduct => (
          <ListRow
            key={savingsProduct.id}
            contents={
              <ListRow.Texts
                type="3RowTypeA"
                top={savingsProduct.name}
                topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                middle={`연 이자율: ${savingsProduct.annualRate}%`}
                middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                bottom={`${formatAmount(savingsProduct.minMonthlyAmount)}원 ~ ${formatAmount(savingsProduct.maxMonthlyAmount)}원 | ${savingsProduct.availableTerms}개월`}
                bottomProps={{ fontSize: 13, color: colors.grey600 }}
              />
            }
            // TODO: select 여부에 따른 check icon
            right={<Assets.Icon name="icon-check-circle-green" />}
            onClick={() => {}}
          />
        ))}
      </>

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
