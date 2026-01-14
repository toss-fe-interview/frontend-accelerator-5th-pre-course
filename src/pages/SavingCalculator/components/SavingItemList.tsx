import { colors, ListRow } from 'tosslib';
import { SavingsProduct } from '../api';

interface SavingItemListProps {
  products: SavingsProduct[];
}

export default function SavingItemList({ products }: SavingItemListProps) {
  return (
    <>
      {products.map(product => (
        <SavingItem key={product.id} {...product} />
      ))}
      {/* 선택된 적금 상품인 경우
      <ListRow
        contents={
          <ListRow.Texts
            type="3RowTypeA"
            top={'기본 정기적금'}
            topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
            middle={'연 이자율: 3.2%'}
            middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
            bottom={'100,000원 ~ 500,000원 | 12개월'}
            bottomProps={{ fontSize: 13, color: colors.grey600 }}
          />
        }
        right={<Assets.Icon name="icon-check-circle-green" />}
        onClick={() => {}}
      />
      */}
    </>
  );
}

function SavingItem({ name, annualRate, minMonthlyAmount, maxMonthlyAmount, availableTerms }: SavingsProduct) {
  return (
    <ListRow
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${minMonthlyAmount.toLocaleString('ko-KR')}원 ~ ${maxMonthlyAmount.toLocaleString('ko-KR')}원 | ${availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      onClick={() => {}}
    />
  );
}
