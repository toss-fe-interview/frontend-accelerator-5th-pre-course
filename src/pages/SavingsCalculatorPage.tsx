import {
  Assets,
  Border,
  ListHeader,
  ListRow,
  NavigationBar,
  SelectBottomSheet,
  Spacing,
  Tab,
  TextField,
} from 'tosslib';
import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CalculationResults } from 'components/CalculationResults';
import { ProductInfoTexts } from 'components/ProductInfoTexts';
import { SwitchCase } from 'components/common/SwitchCase';
import { ProductListStatus, ResultsStatus, SavingsInput, SavingsProduct } from 'type';
import { savingsProductsQuery } from 'apis/savingsProduct';
import { formatMoney, extractDigits } from 'utils/money';
import { isWithinAmountRange, matchesTerm } from 'utils/productFilter';
import { RecommendedProductList } from 'components/RecommendedProductList';

export function SavingsCalculatorPage() {
  const { data: savingsProducts } = useSuspenseQuery(savingsProductsQuery());
  const [savingsInput, setSavingsInput] = useState<SavingsInput>({
    goalAmount: 0,
    monthlyAmount: 0,
    term: 0,
  });
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState<SavingsProduct | null>(null);

  const [selectTab, setSelectTab] = useState<'products' | 'results'>('products');

  const filterMatchingProducts = savingsProducts.filter(
    product => isWithinAmountRange(product, savingsInput.monthlyAmount) && matchesTerm(product, savingsInput.term)
  );

  const updateField = <K extends keyof SavingsInput>(field: K, value: SavingsInput[K]) => {
    setSavingsInput({ ...savingsInput, [field]: value });
  };

  const toMoneyValue = (input: string): number => Number(extractDigits(input)) || 0;

  const getProductListStatus = (): ProductListStatus => {
    if (!(savingsInput.term && savingsInput.monthlyAmount)) {
      return 'needsInput';
    }
    if (filterMatchingProducts.length === 0) {
      return 'noProducts';
    }
    return 'hasProducts';
  };

  const getResultsStatus = (): ResultsStatus => {
    if (!selectedSavingsProduct) {
      return 'noProduct';
    }
    return 'hasProduct';
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={formatMoney(savingsInput.goalAmount)}
        onChange={e => updateField('goalAmount', toMoneyValue(e.target.value))}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={formatMoney(savingsInput.monthlyAmount)}
        onChange={e => updateField('monthlyAmount', toMoneyValue(e.target.value))}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={savingsInput.term}
        onChange={value => updateField('term', value)}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setSelectTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={selectTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={selectTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>
      <Spacing size={8} />
      {selectTab === 'products' && (
        <SwitchCase
          value={getProductListStatus()}
          caseBy={{
            needsInput: (
              <ListRow
                contents={<ListRow.Texts type="1RowTypeA" top="먼저 저축 기간과 월 납입 금액을 입력해주세요." />}
              />
            ),
            noProducts: (
              <ListRow contents={<ListRow.Texts type="1RowTypeA" top="입력한 조건에 맞는 상품이 없습니다." />} />
            ),
            hasProducts: (
              <>
                {filterMatchingProducts.map(product => {
                  const isSelected = selectedSavingsProduct?.id === product.id;

                  return (
                    <ListRow
                      key={product.id}
                      contents={<ProductInfoTexts product={product} />}
                      right={isSelected ? <Assets.Icon name="icon-check-circle-green" /> : null}
                      onClick={() => setSelectedSavingsProduct(product)}
                    />
                  );
                })}
              </>
            ),
          }}
        />
      )}
      {selectTab === 'results' && (
        <SwitchCase
          value={getResultsStatus()}
          caseBy={{
            noProduct: <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />,
            hasProduct: (
              <>
                <CalculationResults selectedProduct={selectedSavingsProduct!} savingsInput={savingsInput} />

                <Spacing size={8} />
                <Border height={16} />
                <Spacing size={8} />

                <ListHeader
                  title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>}
                />
                <Spacing size={12} />
                <RecommendedProductList products={savingsProducts} />
              </>
            ),
          }}
        />
      )}
      <Spacing size={40} />
    </>
  );
}
