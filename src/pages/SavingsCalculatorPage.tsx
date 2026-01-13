import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import { Control, Controller, useForm, UseFormReturn } from 'react-hook-form';
import {
  Assets,
  Border,
  colors,
  http,
  ListHeader,
  ListRow,
  NavigationBar,
  SelectBottomSheet,
  Spacing,
  Tab,
  TextField,
} from 'tosslib';
import { z } from 'zod';

type SavingsProduct = {
  id: string;
  name: string;
  annualRate: number;
  minMonthlyAmount: number;
  maxMonthlyAmount: number;
  availableTerms: number;
};

const savingsCalculatorSchema = z.object({
  minMonthlyAmount: z.number().min(0),
  maxMonthlyAmount: z.number().min(0),
  availableTerms: z.number().min(0),
});

type SavingsCalculatorFormData = z.infer<typeof savingsCalculatorSchema>;

export function SavingsCalculatorPage() {
  const [tab, setTab] = useState<'products' | 'results'>('products');
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct>(undefined);

  const form = useForm({
    defaultValues: {
      availableTerms: 12,
    },
    resolver: zodResolver(savingsCalculatorSchema),
  });

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      <SavingsCalculatorForm control={form.control} />

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setTab(value as 'products' | 'results')}>
        <Tab.Item value="products" selected={tab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={tab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      {tab === 'products' && (
        <Suspense>
          <SavingsProductList selectedProductId={selectedProduct?.id} onSelectedProduct={setSelectedProduct} />
        </Suspense>
      )}
      {tab === 'results' && (
        <Suspense>
          <SavingsCalculatorResults selectedProduct={selectedProduct} />
        </Suspense>
      )}
    </>
  );
}

type SavingsCalculatorFormProps = {
  control: Control<SavingsCalculatorFormData>;
};

function SavingsCalculatorForm({ control }: SavingsCalculatorFormProps) {
  return (
    <>
      <Controller
        name="minMonthlyAmount"
        control={control}
        render={({ field }) => (
          <TextField
            label="목표 금액"
            placeholder="목표 금액을 입력하세요"
            suffix="원"
            value={field.value?.toString()}
            onChange={event => field.onChange(Number(event.target.value))}
          />
        )}
      />

      <Spacing size={16} />
      <Controller
        name="maxMonthlyAmount"
        control={control}
        render={({ field }) => (
          <TextField
            label="월 납입액"
            placeholder="희망 월 납입액을 입력하세요"
            suffix="원"
            value={field.value?.toString()}
            onChange={event => field.onChange(Number(event.target.value))}
          />
        )}
      />
      <Spacing size={16} />
      <Controller
        name="availableTerms"
        control={control}
        render={({ field }) => (
          <SelectBottomSheet
            label="저축 기간"
            title="저축 기간을 선택해주세요"
            value={field.value}
            onChange={value => field.onChange(value)}
          >
            <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
            <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
            <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
          </SelectBottomSheet>
        )}
      />
    </>
  );
}

type SavingsProductListProps = {
  selectedProductId?: string;
  onSelectedProduct: (product: SavingsProduct) => void;
};

function SavingsProductList({ selectedProductId, onSelectedProduct }: SavingsProductListProps) {
  const { data } = useSuspenseQuery({
    queryKey: ['savings-products'],
    queryFn: () => http.get<SavingsProduct[]>('/api/savings-products'),
  });

  return data.map((product: SavingsProduct) => (
    <ListRow
      key={product.id}
      contents={
        <ListRow.Texts
          type="3RowTypeA"
          top={product.name}
          topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
          middle={`연 이자율: ${product.annualRate}%`}
          middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
          bottom={`${product.minMonthlyAmount}원 ~ ${product.maxMonthlyAmount}원 | ${product.availableTerms}개월`}
          bottomProps={{ fontSize: 13, color: colors.grey600 }}
        />
      }
      right={selectedProductId === product.id ? <Assets.Icon name="icon-check-circle-green" /> : undefined}
      onClick={() => onSelectedProduct(product)}
    />
  ));
}

type SavingsCalculatorResultsProps = {
  selectedProduct?: SavingsProduct;
};

function SavingsCalculatorResults({ selectedProduct }: SavingsCalculatorResultsProps) {
  if (!selectedProduct) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  return (
    <>
      <Spacing size={8} />

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

      <RecommendedProductList selectedProduct={selectedProduct} />

      <Spacing size={40} />
    </>
  );
}

type RecommendedProductListProps = {
  selectedProduct: SavingsProduct;
};

function RecommendedProductList({ selectedProduct }: RecommendedProductListProps) {
  const { data } = useSuspenseQuery({
    queryKey: ['savings-products'],
    queryFn: () => http.get<SavingsProduct[]>('/api/savings-products'),
    select: data => data.filter(product => product.id !== selectedProduct.id),
  });
  return (
    <>
      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />
      {data
        .filter(product => product.id !== selectedProduct.id)
        .map((product: SavingsProduct) => (
          <ListRow
            key={product.id}
            contents={
              <ListRow.Texts
                type="3RowTypeA"
                top={product.name}
                topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
                middle={`연 이자율: ${product.annualRate}%`}
                middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
                bottom={`${product.minMonthlyAmount}원 ~ ${product.maxMonthlyAmount}원 | ${product.availableTerms}개월`}
                bottomProps={{ fontSize: 13, color: colors.grey600 }}
              />
            }
            onClick={() => {}}
          />
        ))}
    </>
  );
}
