import { Suspense, useState } from 'react';
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
import { useSavingsProduct } from './useSavingsProduct';

function SavingsCalculatorContent() {
  const {
    filteredProducts,
    selectedProduct,
    recommendedProducts,
    targetAmount,
    monthlyAmount,
    savingsTerm,
    expectedRevenue,
    targetDifference,
    recommendedMonthlyAmount,
    setTargetAmount,
    setMonthlyAmount,
    setSavingsTerm,
    setSelectedProduct,
  } = useSavingsProduct();

  // UI 상태는 컴포넌트에서 직접 관리
  const [selectedTab, setSelectedTab] = useState<'products' | 'results'>('products');

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={targetAmount?.toLocaleString() ?? ''}
        onChange={(e) => {
          const value = e.target.value.replace(/,/g, '');
          setTargetAmount(value ? Number(value) : null);
        }}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyAmount?.toLocaleString() ?? ''}
        onChange={(e) => {
          const value = e.target.value.replace(/,/g, '');
          setMonthlyAmount(value ? Number(value) : null);
        }}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsTerm}
        onChange={(value) => setSavingsTerm(value as number)}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={(value) => setSelectedTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={selectedTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectedTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {selectedTab === 'products' && (
        <>
          {filteredProducts.length === 0 ? (
            <ListRow
              contents={
                <ListRow.Texts
                  type="1RowTypeA"
                  top={
                    monthlyAmount === null
                      ? '월 납입액을 입력하면 적합한 적금 상품을 제공해드립니다.'
                      : '현재 월 납입액에 맞는 적금 상품이 없습니다.'
                  }
                />
              }
            />
          ) : (
            filteredProducts.map((product) => (
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
                right={
                  selectedProduct?.id === product.id ? (
                    <Assets.Icon name="icon-check-circle-green" />
                  ) : undefined
                }
                onClick={() => setSelectedProduct(product)}
              />
            ))
          )}
        </>
      )}

      {selectedTab === 'results' && (
        <>
          {!selectedProduct ? (
            // 상품을 선택하지 않은 경우
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />
          ) : !targetAmount ? (
            // 상품은 선택했지만 목표 금액이 없는 경우
            <ListRow
              contents={
                <ListRow.Texts
                  type="1RowTypeA"
                  top="목표 금액을 입력해 주세요."
                  topProps={{ color: colors.red600 }}
                />
              }
            />
          ) : (
            // 상품도 선택하고 목표 금액도 있는 경우 - 계산 결과 표시
            <>
              <Spacing size={8} />

              <ListRow
                contents={
                  <ListRow.Texts
                    type="2RowTypeA"
                    top="예상 수익 금액"
                    topProps={{ color: colors.grey600 }}
                    bottom={`${expectedRevenue?.toLocaleString()}원`}
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
                    bottom={`${targetDifference?.toLocaleString()}원`}
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
                    bottom={`${recommendedMonthlyAmount?.toLocaleString()}원`}
                    bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
                  />
                }
              />
            </>
          )}

          <Spacing size={8} />
          <Border height={16} />
          <Spacing size={8} />

          <ListHeader
            title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
          />
          <Spacing size={12} />

          {recommendedProducts.length === 0 ? (
            <ListRow contents={<ListRow.Texts type="1RowTypeA" top="추천 상품이 없습니다." />} />
          ) : (
            recommendedProducts.map((product) => (
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
                right={
                  selectedProduct?.id === product.id ? (
                    <Assets.Icon name="icon-check-circle-green" />
                  ) : undefined
                }
                onClick={() => setSelectedProduct(product)}
                style={{ cursor: 'pointer' }}
              />
            ))
          )}

          <Spacing size={40} />
        </>
      )}
    </>
  );
}

export function SavingsCalculatorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SavingsCalculatorContent />
    </Suspense>
  );
}
