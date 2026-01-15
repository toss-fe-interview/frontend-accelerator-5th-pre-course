import { SavingsProduct } from 'entities/savings-product/model/types';
import SavingsProductItem from 'entities/savings-product/ui/SavingsProductItem';
import { SavingsGoalFormData } from 'features/calculate-savings/model/types';
import SavingsGoalForm from 'features/calculate-savings/ui/SavingsGoalForm';
import { useSavingsProducts } from 'features/savings-product/api/useSavingsProducts';
import { SavingsProductFilter } from 'features/savings-product/model/types';
import { useCallback, useMemo, useState } from 'react';
import { Border, NavigationBar, Spacing, Tab } from 'tosslib';

export function SavingsCalculatorPage() {
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);

  const [filter, setFilter] = useState<SavingsGoalFormData>({
    targetAmount: 0,
    monthlyAmount: 0,
    term: 12,
  });
  const memoizedFilter: SavingsProductFilter = useMemo(() => {
    return {
      targetAmount: filter.targetAmount,
      monthlyAmount: filter.monthlyAmount,
      term: filter.term,
    };
  }, [filter]);

  const { data: products } = useSavingsProducts(memoizedFilter);

  const handleSelectProduct = (product: SavingsProduct) => {
    setSelectedProduct(product);
  };

  const handleChangeFilter = useCallback((data: SavingsGoalFormData) => {
    setFilter(data);
  }, []);
  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <SavingsGoalForm onChange={handleChangeFilter} />

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

      {products?.map(product => (
        <SavingsProductItem
          key={product.id}
          product={product}
          selected={selectedProduct?.id === product.id}
          onClick={() => handleSelectProduct(product)}
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
