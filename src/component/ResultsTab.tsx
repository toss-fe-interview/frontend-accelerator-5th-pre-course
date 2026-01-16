import filterProducts from 'utils/filterProducts';
import { useSavingsProducts } from 'hooks/useSavingsProducts';
import { useFormContext } from 'react-hook-form';
import { Assets, Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { ProductSelection } from 'types/calculator';

const ResultsTab = ({ selectedProductId, setSelectedProductId }: ProductSelection) => {
  const { watch } = useFormContext();

  // 데이터 페칭
  const { data: products, isLoading, isError } = useSavingsProducts();

  // 폼 값
  const targetAmount = Number(watch('targetAmount')) || 0;
  const monthlyAmount = Number(watch('monthlyAmount')) || 0;
  const savingPeriod = Number(watch('savingPeriod')) || 0;

  // 상품 필터링
  const filteredProducts = filterProducts(products, monthlyAmount, savingPeriod);

  // 선택된 상품
  const selectedProduct = products?.find(item => item.id === selectedProductId);
  const annualRate = selectedProduct?.annualRate ?? 0;

  // 계산 로직
  const expectedAmount = monthlyAmount * savingPeriod * (1 + (annualRate / 100) * 0.5);
  const difference = targetAmount - expectedAmount;
  const recommendedMonthly =
    savingPeriod > 0 ? Math.round(targetAmount / (savingPeriod * (1 + (annualRate / 100) * 0.5)) / 1000) * 1000 : 0;

  // 추천 상품 (연 이자율 높은 순 2개)
  const recommendedProducts = filteredProducts?.sort((a, b) => b.annualRate - a.annualRate).slice(0, 2) ?? [];

  if (isLoading) {
    return <div>로딩중...</div>;
  }
  if (isError) {
    return <div>에러</div>;
  }

  if (!selectedProductId) {
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
            bottom={`${expectedAmount.toLocaleString()}원`}
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
            bottom={`${difference >= 0 ? '+' : ''}${difference.toLocaleString()}원`}
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
            bottom={`${recommendedMonthly.toLocaleString()}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      {recommendedProducts.map(item => (
        <ListRow
          key={item.id}
          contents={
            <ListRow.Texts
              type="3RowTypeA"
              top={item.name}
              topProps={{ fontSize: 16, fontWeight: 'bold', color: colors.grey900 }}
              middle={`연 이자율: ${item.annualRate}%`}
              middleProps={{ fontSize: 14, color: colors.blue600, fontWeight: 'medium' }}
              bottom={`${item.minMonthlyAmount.toLocaleString()}원 ~ ${item.maxMonthlyAmount.toLocaleString()}원 | ${item.availableTerms}개월`}
              bottomProps={{ fontSize: 13, color: colors.grey600 }}
            />
          }
          right={selectedProductId === item.id && <Assets.Icon name="icon-check-circle-green" />}
          onClick={() => setSelectedProductId(item.id)}
        />
      ))}

      <Spacing size={40} />
    </>
  );
};

export default ResultsTab;
