import { Border, NavigationBar, Spacing } from 'tosslib';
import { SavingsInputForm } from './components/SavingsInputForm';
import { SavingsProductTabView } from './components/SavingsProductTabView';
import { getSavingsProducts } from './api/getSavingsProducts';
import { SavingsProduct } from './types/types';
import { useEffect, useState } from 'react';

export function SavingsCalculatorPage() {
  const [savingsProducts, setSavingsProducts] = useState<SavingsProduct[]>([]);
  const [filteredSavingsProducts, setFilteredSavingsProducts] = useState<SavingsProduct[]>([]);
  const [savingsInput, setSavingsInput] = useState({
    targetAmount: '',
    monthlyAmount: '',
    savingsTerm: 12,
  });

  const handleSavingsInputChange = (key: keyof typeof savingsInput, value: string | number) => {
    setSavingsInput({ ...savingsInput, [key]: value });
  };

  useEffect(() => {
    const fetchSavingsProducts = async () => {
      // TODO: 에러, 로딩 처리
      const response = await getSavingsProducts();
      if (response) {
        setSavingsProducts(response);
      }
    };

    fetchSavingsProducts();
  }, []);

  useEffect(() => {
    if (savingsProducts.length === 0) {
      return;
    }

    const monthlyAmountNumber = Number(savingsInput.monthlyAmount);
    const hasMonthlyAmount = savingsInput.monthlyAmount !== '' && !isNaN(monthlyAmountNumber);

    if (!hasMonthlyAmount) {
      setFilteredSavingsProducts(savingsProducts);
      return;
    }

    const filteredProducts = savingsProducts.filter(product => {
      const isMonthlyAmountValid =
        monthlyAmountNumber >= product.minMonthlyAmount && monthlyAmountNumber <= product.maxMonthlyAmount;
      const isTermMatched = product.availableTerms === savingsInput.savingsTerm;
      return isMonthlyAmountValid && isTermMatched;
    });

    setFilteredSavingsProducts(filteredProducts);
  }, [savingsProducts, savingsInput]);

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsInputForm savingsInput={savingsInput} handleSavingsInputChange={handleSavingsInputChange} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <SavingsProductTabView savingsProducts={filteredSavingsProducts} />

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
