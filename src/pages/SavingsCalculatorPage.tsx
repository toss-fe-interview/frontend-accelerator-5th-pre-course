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
  http,
  isHttpError,
} from 'tosslib';

// features의 어딘가... type 폴더
type SavingsProduct = {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
};

type ProductTabs = 'products' | 'results';

// constants/regex
const CHECK_AMOUNT_REGEX = /^[0-9]*$/;

// utils/format
const fomarKRAmount = (amount: number) => {
  if (!amount) {
    return '';
  }
  return amount.toLocaleString('ko-KR');
};

export function SavingsCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [savingTerms, setSavingTerms] = useState(12);
  const [selectedTab, setSelectedTab] = useState<ProductTabs>('products');
  const [savingProducts, setSavingProducts] = useState<SavingsProduct[]>([]);
  const [selectedSavingProduct, setSelectedSavingProduct] = useState('');

  console.log(targetAmount, monthlyAmount, savingTerms);

  const fetchSavingsProduct = async () => {
    try {
      const response = await http.get<SavingsProduct[]>('/api/savings-products');
      setSavingProducts(response);
    } catch (e) {
      if (isHttpError(e)) {
        console.log(e.message);
      }
    }
  };

  fetchSavingsProduct();

  return (
    <>
      {/* 적금 계산기 컴포넌트 시작 */}
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={fomarKRAmount(Number(targetAmount))}
        onChange={e => {
          const value = e.target.value.slice(0, 13);
          const result = value.replace(/,/g, '');
          if (CHECK_AMOUNT_REGEX.test(result)) {
            setTargetAmount(result ?? '');
          }
        }}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={fomarKRAmount(Number(monthlyAmount))}
        onChange={e => {
          const value = e.target.value.slice(0, 13);
          const result = value.replace(/,/g, '');
          if (CHECK_AMOUNT_REGEX.test(result)) {
            console.log(result);
            setMonthlyAmount(result);
          }
        }}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingTerms}
        onChange={setSavingTerms}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      {/* 적금 상품 컴포넌트 끝 */}
      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      {/* 탭 컴포넌트의 상위 컨트롤 래핑 컴포넌트 시작 */}
      <Tab onChange={value => setSelectedTab(value as ProductTabs)}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === 'products' ? (
        <>
          {savingProducts.map(product => {
            const { annualRate, minMonthlyAmount, maxMonthlyAmount, id, name, availableTerms } = product;
            const description = `${minMonthlyAmount.toLocaleString('ko-KR')}원 ~ ${maxMonthlyAmount.toLocaleString('ko-KR')}원 | ${availableTerms}개월`;
            return (
              <ListRow
                key={id}
                contents={
                  <ListRow.Texts
                    type="3RowTypeA"
                    top={name}
                    topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                    middle={`연 이자율: ${annualRate}%`}
                    middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                    bottom={description}
                    bottomProps={{ fontSize: 13, color: colors.grey600 }}
                  />
                }
                right={selectedSavingProduct === id && <Assets.Icon name="icon-check-circle-green" />}
                onClick={() => setSelectedSavingProduct(id)}
              />
            );
          })}
        </>
      ) : (
        <>
          {selectedSavingProduct ? (
            <>
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
            </>
          ) : (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          )}
        </>
      )}

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      {/* 추천 상품 목록 컴포넌트 시작 */}
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
      {/* 추천 상품 목록 컴포넌트 끝 */}

      <Spacing size={40} />

      {/* 탭 컴포넌트의 상위 컨트롤 래핑 컴포넌트 끝 */}
    </>
  );
}
