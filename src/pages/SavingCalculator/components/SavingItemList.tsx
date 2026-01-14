import { Assets, colors, ListRow } from 'tosslib';

export default function SavingItemList() {
  return (
    <>
      {/* 선택된 적금 상품인 경우 */}
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
      {/* 선택되지 않은 상품인 경우 */}
      <ListRow
        contents={
          <ListRow.Texts
            type="3RowTypeA"
            top={'고급 정기적금'}
            topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
            middle={'연 이자율: 2.8%'}
            middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
            bottom={'50,000원 ~ 1,000,000원 | 24개월'}
            bottomProps={{ fontSize: 13, color: colors.grey600 }}
          />
        }
        onClick={() => {}}
      />
    </>
  );
}
