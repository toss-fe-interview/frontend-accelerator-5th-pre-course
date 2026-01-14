import { useSuspenseQuery } from '@tanstack/react-query';
import SavingProducts from 'product/components/SavingProducts';
import SavingResults from 'product/components/SavingResults';
import { TERMS_OPTIONS } from 'product/constants';
import { savingsProductsQueryOptions } from 'product/queries';
import { SavingProduct } from 'product/type/internal';
import { getFilteredProducts } from 'product/utils/getFilteredProducts';
import { useState } from 'react';
import { Border, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';

const validateInputNumber = (value: string) => {
  return /^[\d,]*$/.test(value);
};

const formatValue = (value: string) => {
  return value.replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export function SavingsCalculatorPage() {
  const [tab, setTab] = useState<'products' | 'results'>('products');
  const [price, setPrice] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [term, setTerm] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<SavingProduct | null>(null);

  const { data: savingsProductsData } = useSuspenseQuery({
    ...savingsProductsQueryOptions,
    select: data => getFilteredProducts(data, monthlyPayment, term),
  });

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

  const selectProduct = (product: SavingProduct) => {
    setSelectedProduct(product);
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

      <Tab onChange={value => setTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={tab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={tab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {tab === 'products' && (
        <SavingProducts
          type="select"
          data={savingsProductsData}
          selectedProduct={selectedProduct}
          selectProduct={selectProduct}
        />
      )}
      {tab === 'results' && (
        <SavingResults selectedProduct={selectedProduct} price={price} monthlyPayment={monthlyPayment} term={term} />
      )}

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
