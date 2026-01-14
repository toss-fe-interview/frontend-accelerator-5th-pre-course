import { useState } from 'react';
import {
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

export function SavingsCalculatorError() {
  const [selectedTab, setSelectedTab] = useState<'products' | 'results'>('products');

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField label="목표 금액" placeholder="목표 금액을 입력하세요" suffix="원" value="" disabled />
      <Spacing size={16} />
      <TextField label="월 납입액" placeholder="희망 월 납입액을 입력하세요" suffix="원" value="" disabled />
      <Spacing size={16} />
      <SelectBottomSheet label="저축 기간" title="저축 기간을 선택해주세요" value={12} onChange={() => {}}>
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSelectedTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      <Spacing size={16} />

      <ListRow
        contents={
          <ListRow.Texts
            type="1RowTypeA"
            top="데이터 수신에서 에러가 발생했습니다."
            topProps={{ color: colors.red600, fontWeight: 'medium' }}
          />
        }
      />

      {selectedTab === 'results' && (
        <>
          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
          <Spacing size={12} />

          <ListRow
            contents={
              <ListRow.Texts
                type="1RowTypeA"
                top="데이터 수신에서 에러가 발생했습니다."
                topProps={{ color: colors.red600, fontWeight: 'medium' }}
              />
            }
          />

          <Spacing size={40} />
        </>
      )}
    </>
  );
}
