import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { queries } from 'shared/api/queries';
import { SavingsProduct } from 'shared/api/type';
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

export function SavingsCalculatorPage() {
  const { data: savingProducts } = useSuspenseQuery(queries.savingsProducts());

  const [목표금액, set목표금액] = useState<number>(0);
  const [월납입액, set월납입액] = useState<number>(0);
  const [저축기간, set저축기간] = useState<6 | 12 | 24>(12);

  const [selectedAmount, setSelectedAmount] = useState<SavingsProduct | null>(null);
  const [selectedTab, setSelectedTab] = useState('products');

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={목표금액.toLocaleString('ko-KR')}
        onChange={e => {
          set목표금액(parseInt(e.target.value.replace(/,/g, ''), 10) || 0);
        }}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={월납입액.toLocaleString('ko-KR')}
        onChange={e => {
          set월납입액(parseInt(e.target.value.replace(/,/g, ''), 10) || 0);
        }}
      />
      <Spacing size={16} />
      <SelectBottomSheet label="저축 기간" title="저축 기간을 선택해주세요" value={저축기간} onChange={set저축기간}>
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>
      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={setSelectedTab}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === 'products' && (
        <>
          {savingProducts
            .filter(
              product =>
                product.minMonthlyAmount <= 월납입액 &&
                product.maxMonthlyAmount >= 월납입액 &&
                product.availableTerms === 저축기간
            )
            .map(product => (
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
                right={selectedAmount?.id === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null}
                onClick={() => setSelectedAmount(product)}
              />
            ))}
        </>
      )}

      {selectedTab === 'results' && (
        <>
          <Spacing size={8} />
          <ListRow
            contents={
              <ListRow.Texts
                type="2RowTypeA"
                top="예상 수익 금액"
                topProps={{ color: colors.grey600 }}
                bottom={`${(월납입액 * 저축기간 * (1 + (selectedAmount?.annualRate ?? 0) * 0.5)).toLocaleString()} 원`}
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
                bottom={`${(
                  목표금액 -
                  월납입액 * 저축기간 * (1 + (selectedAmount?.annualRate ?? 0) * 0.5)
                ).toLocaleString()} 원`}
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
                bottom={`${(
                  Math.round(목표금액 / (저축기간 * (1 + (selectedAmount?.annualRate ?? 0) * 0.5)) / 1000) * 1000
                ).toLocaleString()} 원`}
                bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
              />
            }
          />
          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />

          <Spacing size={12} />

          {savingProducts
            .filter(
              product =>
                product.minMonthlyAmount <= 월납입액 &&
                product.maxMonthlyAmount >= 월납입액 &&
                product.availableTerms === 저축기간
            )
            .slice()
            .sort((a, b) => b.annualRate - a.annualRate)
            .slice(0, 2)
            .map(product => (
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
                right={selectedAmount?.id === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null}
                onClick={() => setSelectedAmount(product)}
              />
            ))}

          {(목표금액 > 0
            ? savingProducts.filter(
                product =>
                  product.minMonthlyAmount <= 월납입액 &&
                  product.maxMonthlyAmount >= 월납입액 &&
                  product.availableTerms === 저축기간
              )
            : savingProducts
          ).slice(0, 2).length === 0 && (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          )}
        </>
      )}
    </>
  );
}
