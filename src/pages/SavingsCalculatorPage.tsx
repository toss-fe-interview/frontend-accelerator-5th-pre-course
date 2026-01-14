import { useSavingsProducts } from 'apis/savings';
import { ProductList } from 'components/ProductList';
import { useMemo, useState } from 'react';
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
import { filterProducts } from 'utils/filterProducts';

interface FormData {
  targetAmount: string;
  monthlyAmount: string;
  savingPeriod: number;
}

export function SavingsCalculatorPage() {
  const { data: products, status } = useSavingsProducts();

  const [formData, setFormData] = useState<FormData>({
    targetAmount: '',
    monthlyAmount: '',
    savingPeriod: 12,
  });

  // 필터링된 상품 목록
  const filteredProducts = useMemo(() => {
    if (!products) {
      return [];
    }

    return filterProducts(products, {
      monthlyAmount: Number(formData.monthlyAmount.replace(/,/g, '')),
      savingPeriod: formData.savingPeriod,
    });
  }, [products, formData.monthlyAmount, formData.savingPeriod]);

  // 숫자 입력 처리 (콤마 포맷팅)
  const handleNumberInput = (field: 'targetAmount' | 'monthlyAmount', value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');
    // 콤마 포맷팅
    const formatted = numbers ? Number(numbers).toLocaleString('ko-KR') : '';
    handleChangeInput(field, formatted);
  };

  const handleChangeInput = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={formData.targetAmount}
        onChange={e => handleNumberInput('targetAmount', e.target.value)}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={formData.monthlyAmount}
        onChange={e => handleNumberInput('monthlyAmount', e.target.value)}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={formData.savingPeriod}
        onChange={value => handleChangeInput('savingPeriod', value)}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

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
      {status === 'pending' && <ListRow contents={<ListRow.Texts type="1RowTypeA" top="로딩 중..." />} />}
      {status === 'error' && <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 불러올 수 없습니다." />} />}
      {status === 'success' && <ProductList products={filteredProducts} />}

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
