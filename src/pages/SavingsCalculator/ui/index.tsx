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
  // -> 'products' | 'results' 타입으로 명시해주면 더 좋지 않을까?
  const [selectedTab, setSelectedTab] = useState('products');

  return (
    <>
      <NavigationBar title="적금 계산기" />
      <Spacing size={16} />

      {/* 2. 저축 목표 입력 기능 만들기
          목표 금액, 월 납입액, 저축 기간을 사용자가 입력할 수 있는 기능을 구현해주세요.

          생각의 흐름
          -> 목표 금액, 월 납입액, 저축 기간을 사용자가 설정할 수 있구나
          -> TestField에서 가장 중요하게 드러나야 하는건 뭘까? -> 내가 어떤 란에 뭘 입력해야 하는지 -> 여기서는 label이랑 value, placeholder가 중요하네
          -> select에서 가장 중요하게 드러나야 하는건 뭘까? -> 내가 뭘 선택해야 하는지 -> 여기서는 label이랑 value 뿐만 아니라 어떤 선택지가 있는지 드러나야겠네
      */}
      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        // 복잡하다고 느끼는 지점 -> 왜 목표금액.toLocaleString('ko-KR')이라고 하는거지? -> 숫자를 한국 원롸 단위로 포멧팅한다고 더 단순하게 표현할 수 없나?
        value={목표금액.toLocaleString('ko-KR')}
        // 복잡하다고 느끼는 지점 -> e.target.value.replace(/,/g, '') 이부분이 뭐지? -> 왜 parInt를 해주는거지? -> 사용자의 목표 금액에 콤마를 제거해주는 역할이라는 것이 드러나지 않아
        onChange={e => {
          set목표금액(parseInt(e.target.value.replace(/,/g, ''), 10) || 0);
        }}
      />

      <Spacing size={16} />

      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        // 복잡하다고 느끼는 지점 -> 왜 목표금액.toLocaleString('ko-KR')이라고 하는거지? -> 숫자를 한국 원롸 단위로 포멧팅한다고 더 단순하게 표현할 수 없나?
        value={월납입액.toLocaleString('ko-KR')}
        // 복잡하다고 느끼는 지점 -> e.target.value.replace(/,/g, '') 이부분이 뭐지? -> 왜 parInt를 해주는거지? -> 사용자의 목표 금액에 콤마를 제거해주는 역할이라는 것이 드러나지 않아
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

      {/* 2. 저축 목표 입력 기능 만들기
          입력한 조건에 맞춰서 하단 적금 상품 목록에 보이는 상품 목록(ProductList)을 조건에 맞게 필터링해서 출력해주세요.
      */}
      {selectedTab === 'products' && (
        <>
          {/* 
            요구사항
            기존 상품 목록에서 아래 조건에 맞춰서 필터링 한 데이터를 출력해야함
            - 월 납입액
              - `product.minMonthlyAmount` (최소 월 납입액)보다 크고
              - `product.maxMonthlyAmount` (최대 월 납입액)보다 작아야 함
            - 저축 기간
            - `product.availableTerms` (저축 기간)와 동일해야 함 
          */}

          {/* 
            생각의 흐름
            -> API로 불러는 데이터에 필터링을 거는구나
            -> 필터를 거는 조건이 너무 길어서 읽기가 어렵네
            -> 필터링 로직을 따로 빼내볼까?
          */}
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
                  // -> ListRow.Texts에 전달되는 Props는 이 컴포넌트에서 꼭 알아야 할까?
                  // -> ListRow.Texts가 아니라 적금 상품이라는 이름으로 필요한 정보만 묶여서 전달되면 더 이해하기 쉽지 않을까?
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
                // -> 명시적으로 isSelected 라는 조건으로 삼항연산자를 쓰는게 더 읽기 쉽지 않을까?
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
              // -> type, topProps, bottomProps와 같은 정보가 여기서 꼭 필요할까?
              // -> ListRow.Texts도 적금 계산 결과라는 이름으로 필요한 정보만 묶여서 전달되면 더 이해하기 쉽지 않을까?
              // -> ListRow가 껍데기 역할만 하고 내부 content로는 무엇을 넣으려고 하는지 명시적인 이름으로 전달되면 더 이해가 쉽겠다
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
              // -> type, topProps, bottomProps와 같은 정보가 여기서 꼭 필요할까?
              // -> ListRow.Texts도 적금 계산 결과라는 이름으로 필요한 정보만 묶여서 전달되면 더 이해하기 쉽지 않을까?
              // -> ListRow가 껍데기 역할만 하고 내부 content로는 무엇을 넣으려고 하는지 명시적인 이름으로 전달되면 더 이해가 쉽겠다
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
              // -> type, topProps, bottomProps와 같은 정보가 여기서 꼭 필요할까?
              // -> ListRow.Texts도 적금 계산 결과라는 이름으로 필요한 정보만 묶여서 전달되면 더 이해하기 쉽지 않을까?
              // -> ListRow가 껍데기 역할만 하고 내부 content로는 무엇을 넣으려고 하는지 명시적인 이름으로 전달되면 더 이해가 쉽겠다
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
          {/* 
            요구사항
            기존 상품 목록에서 아래 조건에 맞춰서 필터링 한 후,
            - 월 납입액
              - `product.minMonthlyAmount` (최소 월 납입액)보다 크고
              - `product.maxMonthlyAmount` (최대 월 납입액)보다 작아야 함
            - 저축 기간
            - `product.availableTerms` (저축 기간)와 동일해야 함 

            필터링 된 데이터 중에서 연 이자율(annualRate)이 높은 순서대로 최대 2개까지 노출
          */}

          {/* 
            생각의 흐름
            -> 이거 앞에서 본 필터링 로직이랑 똑같네
            -> 필터링 로직을 따로 빼내볼까?
            -> 필터링 된 데이터 중에서 연 이자율이 높은 순서대로 최대 2개까지 노출해야 하는구나
            -> 
          */}
          {savingProducts
            .filter(
              product =>
                product.minMonthlyAmount <= 월납입액 &&
                product.maxMonthlyAmount >= 월납입액 &&
                product.availableTerms === 저축기간
            )
            .sort((a, b) => b.annualRate - a.annualRate)
            .slice(0, 2)
            .map(product => (
              <ListRow
                key={product.id}
                contents={
                  // -> ListRow.Texts에 전달되는 Props는 이 컴포넌트에서 꼭 알아야 할까?
                  // -> ListRow.Texts가 아니라 적금 상품이라는 이름으로 필요한 정보만 묶여서 전달되면 더 이해하기 쉽지 않을까?
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
                // -> 명시적으로 isSelected 라는 조건으로 삼항연산자를 쓰는게 더 읽기 쉽지 않을까?
                right={selectedAmount?.id === product.id ? <Assets.Icon name="icon-check-circle-green" /> : null}
                onClick={() => setSelectedAmount(product)}
              />
            ))}

          {/* 
            요구사항
            사용자가 입력한 조건에 맞는 적금 상품 중 연 이자율이 가장 높은 2개의 상품을 출력해주세요.
            
            생각의 흐름
            -> 사용자가 상품을 선택하지 않으면 "상품을 선택해주세요"라는 문구만 보이면 되는데 왜이렇게 로직이 복잡하지?
            -> 데이터와 상관 없이 위에 selectedAmount라는 state를 사용해서 조건부 렌더링 시키면 되지 않을까?
            -> 본질(what)은 사용자가 선택한 상품이 없을 때 보여주는 문구
            -> 세부사항(how) 자체가 아예 필요 없었네
            -> selectedAmount에 따른 삼항연산자 내부로 옮겨볼까?
          */}
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
