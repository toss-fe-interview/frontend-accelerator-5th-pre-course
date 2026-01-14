import { useSuspenseQuery } from '@tanstack/react-query';
import { TERMS_OPTIONS } from 'product/constants';
import { savingsProductsQueryOptions } from 'product/queries';
import { useState } from 'react';
import {
  Assets,
  Border,
  colors,
  ListHeader,
  ListRow,
  NavigationBar,
  SelectBottomSheet,
  Spacing,
  Tab,
  TextField,
} from 'tosslib';

const validateInputNumber = (value: string) => {
  return /^[\d,]*$/.test(value);
};

const formatValue = (value: string) => {
  return value.replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export function SavingsCalculatorPage() {
  const [price, setPrice] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [term, setTerm] = useState(0);

  const { data: savingsProductsData } = useSuspenseQuery({
    ...savingsProductsQueryOptions,
    select: data => {
      return data.filter(product => {
        if (
          product.minMonthlyAmount > Number(monthlyPayment.replace(/,/g, '')) ||
          product.maxMonthlyAmount < Number(monthlyPayment.replace(/,/g, ''))
        ) {
          return;
        }

        return product.availableTerms === term;
      });
    },
  });

  console.log(savingsProductsData);

  const handlePriceChange = (value: string) => {
    if (!validateInputNumber(value)) {
      return;
    }

    const formattedValue = formatValue(value);

    setPrice(formattedValue);
  };

  const handleMonthlyPaymentChange = (value: string) => {
    if (!validateInputNumber(value)) {
      return;
    }

    const formattedValue = formatValue(value);

    setMonthlyPayment(formattedValue);
  };

  const handleTermChange = (value: number) => {
    setTerm(value);
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={price}
        onChange={e => handlePriceChange(e.target.value)}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyPayment}
        onChange={e => handleMonthlyPaymentChange(e.target.value)}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={term}
        onChange={value => handleTermChange(value)}
      >
        {TERMS_OPTIONS.map(option => (
          <SelectBottomSheet.Option key={option.value} value={option.value}>
            {option.label}
          </SelectBottomSheet.Option>
        ))}
      </SelectBottomSheet>

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

      {savingsProductsData.map(product => (
        <ListRow
          key={product.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={product.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${product.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${product.minMonthlyAmount.toLocaleString()}원 ~ ${product.maxMonthlyAmount.toLocaleString()}원 | ${product.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={<Assets.Icon name="icon-check-circle-green" />}
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
